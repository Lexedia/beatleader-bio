/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { JSX } from 'solid-js'
import { DROSTE_VARIANTS, type DrosteArt, type DrosteBox } from '../utils/droste'

const DEPTH = 3

function place(box: DrosteBox) {
  return `left: ${box.x}%; top: ${box.y}%; width: ${box.w}%; height: ${box.h}%;`
}

function miniature(art: DrosteArt, depth: number): JSX.Element {
  return (
    <span class="droste-frame" style={depth > 0 ? place(art.slot) : undefined}>
      {depth < DEPTH && DROSTE_VARIANTS.map((variant) => (
        <img class={`droste-art droste-art-${variant}`} src={art.sources[variant]} alt="" />
      ))}
      {depth < DEPTH && miniature(art, depth + 1)}
    </span>
  )
}

export function RecursionSwitch() {
  return (
    <>
      <input type="radio" name="recursion" id="recursion-closed" class="recursion-radio" checked />
      <input type="radio" name="recursion" id="recursion-a" class="recursion-radio" />
      <input type="radio" name="recursion" id="recursion-b" class="recursion-radio" />
    </>
  )
}

export function Recursion(props: { art: DrosteArt }) {
  return (
    <label for="recursion-closed" class="recursion" title="Climb back out">
      <span class="droste-tunnel" aria-hidden="true">{miniature(props.art, 0)}</span>
      <span class="recursion-caption">
        <span class="recursion-title">you're already here ✧</span>
        <span class="recursion-hint">you found the white rabbit</span>
        <span class="recursion-overflow">RangeError: Maximum call stack size exceeded</span>
      </span>
    </label>
  )
}
