/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import * as opentype from 'opentype.js'
import stackSansNotchUrl from '../../assets/StackSansNotch.ttf?inline'
import tekoUrl from '../../assets/Teko.ttf?inline'

export interface FontAsset {
  family: string
  dataUrl: string
  font: opentype.Font
}

function loadFont(family: string, dataUrl: string): FontAsset {
  const bytes = Uint8Array.from(atob(dataUrl.slice(dataUrl.indexOf(',') + 1)), (c) => c.charCodeAt(0))
  return {
    family,
    dataUrl,
    font: opentype.parse(bytes.buffer),
  }
}

export const fonts = {
  stackSansNotch: loadFont('Stack Sans Notch', stackSansNotchUrl),
  teko: loadFont('Teko', tekoUrl),
}

export function fontFaceCss(): string {
  return Object.values(fonts)
    .map((f) => `@font-face{font-family:"${f.family}";src:url(${f.dataUrl});font-display:swap}`)
    .join('')
}
