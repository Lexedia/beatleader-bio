/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { FontAsset } from '../data/fonts'
import type { BioConfig } from '../data/bioConfig'
import { layoutSvgText, type SvgTextOptions } from '../utils/svgText'

interface FontTextProps extends SvgTextOptions {
  font: FontAsset
  mode: BioConfig['fontRendering']
  children: string
  /**
   * sabre-coloured glint passing over the letters one by one
   */
  glint?: boolean
}

const GLINT_STAGGER = 0.09

function glintDelay(index: number) {
  return `${(index * GLINT_STAGGER).toFixed(2)}s`
}

function glintLetters(text: string) {
  const letters = [ ...new Intl.Segmenter().segment(text) ].map((part) => part.segment)
  return letters.map((letter, i) => letter.trim()
    ? (
      <span class="text-glint">
        {letter}
        <span class="text-glint-flash" aria-hidden="true" style={{ 'animation-delay': glintDelay(i) }}>{letter}</span>
      </span>
    )
    : letter)
}

/**
 * Text with a custom font. In 'font-face' mode it's plain text (the CSS font-family applies);
 * in 'svg' mode the glyphs are baked into inline SVG paths, since BeatLeader strips @font-face rules.
 * Each SVG run gets a transparent copy of its text laid over it, so it can still be selected and
 * read by screen readers (BeatLeader strips the SVG's role and aria-label).
 */
export function FontText(props: FontTextProps) {
  if (props.mode !== 'svg')
    return (
      <span
        style={{
          'font-family': `"${props.font.family}", var(--font)`,
          'font-weight': props.weight,
          'letter-spacing': props.letterSpacing ? `${props.letterSpacing}em` : undefined,
        }}
      >
        {props.glint ? glintLetters(props.children) : props.children}
      </span>
    )

  return (
    <>
      {layoutSvgText(props.font.font, props.children, props).map((run) => run.kind === 'text'
        ? run.text
        : (
          <span class="svg-text-wrap" style={{ 'vertical-align': run.verticalAlign }}>
            <svg
              class="svg-text"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              viewBox={run.viewBox}
              width={run.width}
              height={run.height}
              fill="currentColor"
              style={{ overflow: 'visible' }}
            >
              <path d={run.d} />
              {props.glint && run.glyphs.map((d, i) => (
                <path class="svg-text-glint" d={d} style={{ 'animation-delay': glintDelay(i) }} />
              ))}
            </svg>
            <span class="svg-text-copy" style={{ 'line-height': run.height }}>{run.text}</span>
          </span>
        ))}
    </>
  )
}
