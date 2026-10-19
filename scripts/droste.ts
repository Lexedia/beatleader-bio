/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { measure, renderSvg, type MeasuredNode } from 'takumi-js'
import { googleFonts, subsetFonts } from 'takumi-js/helpers'
import { Renderer } from 'takumi-js/node'
import {
  DROSTE_VARIANTS, type DrosteArt, type DrosteBox, type DrosteVariant,
} from '../src/utils/droste'

/*
 * Builds the miniature bio for the recursion easter egg: Takumi lays out and paints the real bio
 * HTML and CSS into SVG, so the miniature is the actual bio, text, avatar and all, and always
 * matches it without anyone having to keep a hand-drawn copy in step.
 *
 * BeatLeader's sanitiser keeps little of an inline SVG beyond bare paths (no groups, <use>, clip
 * paths or images), so the paintings are written to assets/ as files and the bio shows them as
 * images, which it can load from raw.githubusercontent.com. CSS variables can't reach into an
 * image, so there's one painting per family of BeatLeader themes.
 */

export interface Droste {
  art: DrosteArt
  // The zoom keyframes, which depend on where the button ended up
  css: string
}

const WIDTH = 880

// The theme class each painting is rendered under, matching the selectors in _themes.scss
const THEME_CLASSES: Record<DrosteVariant, string | undefined> = {
  dark: undefined,
  glass: 'mirror-theme',
  light: 'flylight-theme',
}

/*
 * BeatLeader shows the bio in the system font, which a build machine can't count on having, so
 * Roboto stands in, with Noto covering the kaomoji and sparkles the main fonts lack. They're tried
 * in this order for any character the font asked for doesn't have.
 */
const FALLBACK_FONTS = [
  'Roboto',
  'Noto Sans JP',
  'Noto Sans Symbols',
  'Noto Sans Symbols 2',
  'Noto Sans Math',
  'Noto Sans Vai',
  'Noto Sans Yi',
]

const LOCAL_FONTS = [
  'StackSansNotch.ttf',
  'Teko.ttf',
]

/*
 * The bio as it sits at rest with the first tab open, minus its own glows and the miniature's own
 * BeatLeader button, which is where the next miniature goes.
 */
const PORTRAIT_CSS = `
.bl-bio .recursion, .bl-bio .lava, .bl-bio .aura { display: none }
.bl-bio .backdrop { mask-image: none; -webkit-mask-image: none }
.bl-bio .tab-panels .panel-1 { display: block }
.bl-bio .tab-nav label[for="tab-1"] { background: var(--pink-accent); color: #ffffff }
.bl-bio * {
  backdrop-filter: none !important;
  animation: none !important;
  transition: none !important;
}
.bl-bio .spoiler-content { color: transparent !important; filter: none !important; background: var(--text-muted); border-radius: 4px; opacity: 0.4 }
.bl-bio .social-link-recursive { border-color: var(--pink-accent) !important }
.bl-bio .social-link-recursive > * { visibility: hidden }
`

// Elements painted fully transparent (the resting glint copies, mostly), which only bloat the output
const INVISIBLE_ELEMENT = /<(?:use|path)\b(?=[^>]*\bfill-opacity="0")(?![^>]*\bstroke-opacity="(?!0")[^"]*")[^>]*\/>\s*/g
const INVISIBLE_GROUP = /<g\b[^>]*\bfill-opacity="0"[^>]*>(?:\s*<use\b[^>]*\/>)*\s*<\/g>\s*/g
const EMPTY_GROUP = /<g\b[^>]*>\s*<\/g>\s*/g

function attribute(element: string, name: string) {
  return element.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]
}

/*
 * Takumi embeds the bio's inline SVGs (icons, emoji, note arrows) as images, where the page's CSS
 * no longer reaches them: icons that take their colour from CSS come out black. Nesting them back
 * in as plain SVG with that colour filled in fixes them, and saves the base64 bloat too.
 *
 * @param iconColour what the social icons are coloured on the page
 */
function inlineSvgImages(svg: string, iconColour: string) {
  return svg.replace(/<image\b[^>]*href="data:image\/svg\+xml;base64,([^"]+)"[^>]*\/>/g, (image, data: string) => {
    const inner = Buffer.from(data, 'base64').toString('utf-8')
    const root = inner.match(/<svg\b[^>]*>/)?.[0]
    if (!root) {
      return image
    }

    const colour = attribute(root, 'color') ?? iconColour
    const fill = root.includes('class="note-arrow"') ? 'rgba(255,255,255,0.92)' : attribute(root, 'fill') ?? 'currentColor'
    const placed = [
      'x',
      'y',
      'width',
      'height',
    ].map((name) => `${name}="${attribute(image, name) ?? 0}"`).join(' ')
    const viewBox = attribute(root, 'viewBox')

    return inner.replace(root, `<svg ${placed}${viewBox ? ` viewBox="${viewBox}"` : ''} fill="${fill}" color="${colour}">`)
  })
}

function tidySvg(svg: string, iconColour: string) {
  let out = inlineSvgImages(svg, iconColour)
    .replace(INVISIBLE_GROUP, '')
    .replace(INVISIBLE_ELEMENT, '')

  // Removing one empty group can leave its parent empty too
  for (let previous = ''; previous !== out;) {
    previous = out
    out = out.replace(EMPTY_GROUP, '')
  }

  // Glyphs nothing visible uses any more
  const used = new Set([ ...out.matchAll(/href="#(g\d+)"/g) ].map((match) => match[1]))
  out = out.replace(/<path id="(g\d+)"[^>]*\/>\s*/g, (element, id: string) => used.has(id) ? element : '')

  /*
   * Stretched to whatever size the bio currently is, which changes with the open tab; every level
   * stretches the same way, so they still line up
   */
  return out.replace(/<svg\b([^>]*)>/, '<svg$1 preserveAspectRatio="none">')
}

// A custom property's value under a theme, read from the compiled stylesheet
function themeValue(css: string, themeClass: string | undefined, name: string): string | undefined {
  const block = themeClass ? `\\.${themeClass} \\.bl-bio` : ':root'
  return css.match(new RegExp(`${block}\\s*\\{[^}]*--${name}:\\s*([^;}]+)`))?.[1]?.trim()
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

function rectOf(node: MeasuredNode): Rect {
  return {
    x: node.transform[4],
    y: node.transform[5],
    width: node.width,
    height: node.height,
  }
}

// Every laid-out node with its absolute rectangle, keeping the parent around for each
function flatten(node: MeasuredNode, parent?: MeasuredNode, out: {
  node: MeasuredNode
  parent?: MeasuredNode
  rect: Rect
}[] = []) {
  out.push({
    node,
    parent,
    rect: rectOf(node),
  })
  node.children.forEach((child) => flatten(child, node, out))
  return out
}

function round(n: number) {
  return Number(n.toFixed(3))
}

function zoomKeyframes(slot: DrosteBox) {
  const ratio = slot.w / 100
  /*
   * The one point the zoom leaves in place, where the button inside the button inside the button
   * converges, so growing by 1 / ratio around it lands each level exactly on its parent
   */
  const originX = slot.x / (1 - ratio)
  const originY = slot.y / (1 - ratio)

  // In tenths so the zoom feels like a steady speed rather than an exponential lurch
  const steps = Array.from({ length: 11 }, (_, i) => {
    const scale = (1 / ratio) ** (i / 10)
    return `${i * 10}%{top:${round(originY * (1 - scale))}%;left:${round(originX * (1 - scale))}%;width:${round(100 * scale)}%;height:${round(100 * scale)}%}`
  })

  return `@keyframes droste-zoom{${steps.join('')}}`
    + `.bl-bio .recursion{transform-origin:${round(slot.x + (slot.w / 2))}% ${round(slot.y + (slot.h / 2))}%}`
}

async function makeRenderer(html: string) {
  const renderer = new Renderer()

  // Only the slices of each font the bio actually uses
  const text = html.replace(/<[^>]*>/g, ' ')
  const fallbacks = subsetFonts({
    fonts: await googleFonts(FALLBACK_FONTS),
    source: text,
  })
  for (const font of fallbacks) {
    await renderer.registerFont({
      name: font.name,
      weight: font.weight,
      style: font.style,
      unicodeRange: font.unicodeRange,
      data: await font.data(),
    })
  }

  for (const font of LOCAL_FONTS) {
    await renderer.registerFont({ data: fs.readFileSync(path.resolve(process.cwd(), 'assets', font)) })
  }

  return renderer
}

// Where the BeatLeader button is, and so where the next miniature sits
function findSlot(layout: MeasuredNode, linkText: string): DrosteBox {
  const { width, height } = layout
  const label = flatten(layout).find(({ node, rect }) => rect.width > 0 && node.runs.some((run) => run.text.trim() === linkText))
  if (!label?.parent) {
    throw new Error(`Couldn't find the "${linkText}" link in the bio to put the miniature in`)
  }
  const button = rectOf(label.parent)

  // As big as fits inside the button's border while keeping the bio's own proportions
  const inset = 3
  const ratio = Math.min((button.height - (inset * 2)) / height, (button.width - (inset * 2)) / width)
  return {
    x: round((button.x + (button.width / 2) - ((ratio * width) / 2)) / width * 100),
    y: round((button.y + (button.height / 2) - ((ratio * height) / 2)) / height * 100),
    w: round(ratio * 100),
    h: round(ratio * 100),
  }
}

/*
 * Paints the bio once per theme family into assets/droste-<variant>.svg.
 *
 * @param html the bio as rendered for BeatLeader
 * @param css the bio's stylesheet
 * @param linkText the label on the social link that leads back to this page
 * @param assetsUrl where assets/ is served from
 */
export async function buildDroste(html: string, css: string, linkText: string, assetsUrl: string): Promise<Droste> {
  const renderer = await makeRenderer(html)
  const stylesheet = css.replace(/@import[^;]+;/g, '')
  const defaultIconColour = themeValue(css, undefined, 'text-secondary') ?? '#c9bfd4'

  let slot: DrosteBox | undefined
  const sources = {} as Record<DrosteVariant, string>
  for (const variant of DROSTE_VARIANTS) {
    const themeClass = THEME_CLASSES[variant]
    const themed = themeClass ? `<div class="${themeClass}">${html}</div>` : html
    const options = {
      renderer,
      width: WIDTH,
      css: [
        stylesheet,
        PORTRAIT_CSS,
      ],
    }

    const [
      rawSvg,
      layout,
    ] = await Promise.all([
      renderSvg(themed, options),
      measure(themed, options),
    ])
    slot ??= findSlot(layout, linkText)

    const svg = tidySvg(rawSvg, themeValue(css, themeClass, 'text-secondary') ?? defaultIconColour)
    const file = `droste-${variant}.svg`
    fs.writeFileSync(path.resolve(process.cwd(), 'assets', file), svg, 'utf-8')

    // The content hash busts caches whenever the painting changes
    const hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 10)
    sources[variant] = `${assetsUrl}/${file}?v=${hash}`
    console.log(`Painted ${file} (~${(svg.length / 1024).toFixed(2)} KiB).`)
  }

  return {
    art: {
      sources,
      slot: slot!,
    },
    css: zoomKeyframes(slot!),
  }
}
