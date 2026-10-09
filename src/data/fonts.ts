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
  googleSpec: string
  dataUrl: string
  font: opentype.Font
}

function loadFont(family: string, googleSpec: string, dataUrl: string): FontAsset {
  const bytes = Uint8Array.from(atob(dataUrl.slice(dataUrl.indexOf(',') + 1)), (c) => c.charCodeAt(0))
  return {
    family,
    googleSpec,
    dataUrl,
    font: opentype.parse(bytes.buffer),
  }
}

export const fonts = {
  stackSansNotch: loadFont('Stack Sans Notch', 'Stack+Sans+Notch:wght@200..700', stackSansNotchUrl),
  teko: loadFont('Teko', 'Teko:wght@300..700', tekoUrl),
}

export function fontFaceCss(): string {
  return Object.values(fonts)
    .map((f) => `@font-face{font-family:"${f.family}";src:url(${f.dataUrl});font-display:swap}`)
    .join('')
}

export function googleFontsImport(): string {
  const families = Object.values(fonts).map((f) => `family=${f.googleSpec}`).join('&')
  return `@import url("https://fonts.googleapis.com/css2?${families}&display=swap");`
}
