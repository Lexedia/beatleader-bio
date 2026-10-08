/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { Font } from 'opentype.js'

export interface SvgTextOptions {
  size: number
  weight?: number
  letterSpacing?: number
}

export type SvgTextRun =
  | {
    kind: 'text'
    text: string
  }
  | {
    kind: 'svg'
    text: string
    d: string
    glyphs: string[]
    viewBox: string
    width: string
    height: string
    verticalAlign: string
  }

const em = (units: number, upm: number) => `${+(units / upm).toFixed(4)}em`


function syntheticBoldRatio(font: Font, opts: SvgTextOptions): number {
  const faceWeight = font.tables.os2?.usWeightClass ?? 400
  if ((opts.weight ?? 400) < 600 || faceWeight > 500)
    return 0
  const t = Math.min(Math.max((opts.size - 9) / 27, 0), 1)
  return (1 / 24) + (t * ((1 / 32) - (1 / 24)))
}

export function layoutSvgText(font: Font, text: string, opts: SvgTextOptions): SvgTextRun[] {
  const runs: {
    svg: boolean
    text: string
  }[] = []
  for (const ch of text) {
    const svg = /\s/.test(ch) || font.hasChar(ch)
    const last = runs[runs.length - 1]
    if (last && last.svg === svg)
      last.text += ch
    else
      runs.push({
        svg,
        text: ch,
      })
  }

  const upm = font.unitsPerEm
  const ascender = font.ascender
  const descender = font.descender
  const renderOpts = {
    kerning: true,
    letterSpacing: opts.letterSpacing ?? 0,
  }
  const boldRatio = syntheticBoldRatio(font, opts)

  return runs.map((run): SvgTextRun => {
    if (!run.svg)
      return {
        kind: 'text',
        text: run.text,
      }

    const advance = font.getAdvanceWidth(run.text, upm, renderOpts)
    const h = (boldRatio * upm) / 2
    const shifts = h ? [
      -h,
      h,
    ] : [ 0 ]
    const copies = shifts.flatMap((y) => shifts.map((x) => font.getPaths(run.text, x, y, upm, renderOpts).map((p) => p.toPathData(0))))
    const glyphs = copies[0].map((_, i) => copies.map((c) => c[i]).join('')).filter(Boolean)
    return {
      kind: 'svg',
      text: run.text,
      d: glyphs.join(''),
      glyphs,
      viewBox: `0 ${-ascender} ${Math.ceil(advance)} ${ascender - descender}`,
      width: em(advance, upm),
      height: em(ascender - descender, upm),
      verticalAlign: em(descender, upm),
    }
  })
}
