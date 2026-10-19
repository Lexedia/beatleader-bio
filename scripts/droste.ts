/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { measure, render, type MeasuredNode } from 'takumi-js'
import { googleFonts, subsetFonts } from 'takumi-js/helpers'
import { Renderer } from 'takumi-js/node'
import {
  DROSTE_VARIANTS, type DrosteArt, type DrosteBox, type DrosteVariant,
} from '../src/utils/droste'

export interface Droste {
  art: DrosteArt
  css: string
}

const WIDTH = 880

const PIXEL_RATIO = 3

const THEME_CLASSES: Record<DrosteVariant, string | undefined> = {
  dark: undefined,
  glass: 'mirror-theme',
  light: 'flylight-theme',
}

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
.bl-bio .social-link-recursive { visibility: hidden }
`

function colourInlineSvgs(html: string) {
  return html
    .replace(/<svg class="note-arrow"/g, '<svg class="note-arrow" fill="rgba(255,255,255,0.92)"')
    .replace(/<svg(?![^>]*\sfill=)/g, '<svg fill="currentColor"')
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
  const originX = slot.x / (1 - ratio)
  const originY = slot.y / (1 - ratio)

  const steps = Array.from({ length: 11 }, (_, i) => {
    const scale = (1 / ratio) ** (i / 10)
    return `${i * 10}%{top:${round(originY * (1 - scale))}%;left:${round(originX * (1 - scale))}%;width:${round(100 * scale)}%;height:${round(100 * scale)}%}`
  })

  return `@keyframes droste-zoom{${steps.join('')}}`
    + `.bl-bio .recursion{transform-origin:${round(slot.x + (slot.w / 2))}% ${round(slot.y + (slot.h / 2))}%}`
}

async function makeRenderer(html: string) {
  const renderer = new Renderer()

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

function percentages(rect: Rect, width: number, height: number): DrosteBox {
  return {
    x: round(rect.x / width * 100),
    y: round(rect.y / height * 100),
    w: round(rect.width / width * 100),
    h: round(rect.height / height * 100),
  }
}

function findButton(layout: MeasuredNode, linkText: string) {
  const { width, height } = layout
  const label = flatten(layout).find(({ node, rect }) => rect.width > 0 && node.runs.some((run) => run.text.trim() === linkText))
  if (!label?.parent) {
    throw new Error(`Couldn't find the "${linkText}" link in the bio to put the miniature in`)
  }
  const button = rectOf(label.parent)

  const inset = 3
  const ratio = Math.min((button.height - (inset * 2)) / height, (button.width - (inset * 2)) / width)
  return {
    button: percentages(button, width, height),
    slot: percentages({
      x: button.x + (button.width / 2) - ((ratio * width) / 2),
      y: button.y + (button.height / 2) - ((ratio * height) / 2),
      width: ratio * width,
      height: ratio * height,
    }, width, height),
  }
}

function buttonCss() {
  const px = (n: number) => `${round(n / WIDTH * 100)}cqw`
  return `.bl-bio .droste-button{box-shadow:inset 0 0 0 ${px(1)} var(--pink-accent);border-radius:${px(10)}}`
}

export async function buildDroste(html: string, css: string, linkText: string, assetsUrl: string): Promise<Droste> {
  const renderer = await makeRenderer(html)
  const stylesheet = css.replace(/@import[^;]+;/g, '')
  const coloured = colourInlineSvgs(html)

  let place: ReturnType<typeof findButton> | undefined
  const sources = {} as Record<DrosteVariant, string>
  for (const variant of DROSTE_VARIANTS) {
    const themeClass = THEME_CLASSES[variant]
    const themed = themeClass ? `<div class="${themeClass}">${coloured}</div>` : coloured
    const options = {
      renderer,
      width: WIDTH,
      css: [
        stylesheet,
        PORTRAIT_CSS,
      ],
    }

    place ??= findButton(await measure(themed, options), linkText)
    const image = await render(themed, {
      ...options,
      width: WIDTH * PIXEL_RATIO,
      format: 'webp',
      quality: 88,
      devicePixelRatio: PIXEL_RATIO,
    })

    const file = `droste-${variant}.webp`
    fs.writeFileSync(path.resolve(process.cwd(), 'assets', file), image)

    const hash = crypto.createHash('sha256').update(image).digest('hex').slice(0, 10)
    sources[variant] = `${assetsUrl}/${file}?v=${hash}`
    console.log(`Painted ${file} (~${(image.length / 1024).toFixed(2)} KiB).`)
  }

  return {
    art: {
      sources,
      ...place!,
    },
    css: zoomKeyframes(place!.slot) + buttonCss(),
  }
}
