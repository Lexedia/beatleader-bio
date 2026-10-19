/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

export const DROSTE_VARIANTS = [
  'dark',
  'glass',
  'light',
] as const

export type DrosteVariant = typeof DROSTE_VARIANTS[number]

export interface DrosteBox {
  x: number
  y: number
  w: number
  h: number
}

export interface DrosteArt {
  sources: Record<DrosteVariant, string>
  slot: DrosteBox
}
