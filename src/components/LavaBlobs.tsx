/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

interface LavaBlob {
  x: number
  y: number
  size: number
  colour: string
  path: 'a' | 'b' | 'c'
  sinks?: boolean
  duration: number
  delay: number
}


const BLOBS: LavaBlob[] = [
  {
    x: 8,
    y: 62,
    size: 150,
    colour: 'var(--pink-accent)',
    path: 'a',
    duration: 26,
    delay: 0,
  },
  {
    x: 68,
    y: 66,
    size: 170,
    colour: 'var(--purple-accent)',
    path: 'b',
    duration: 31,
    delay: -9,
  },
  {
    x: 34,
    y: 78,
    size: 90,
    colour: 'var(--pink-deep)',
    path: 'c',
    duration: 19,
    delay: -4,
  },
  {
    x: 82,
    y: 18,
    size: 110,
    colour: 'var(--purple-accent)',
    path: 'a',
    sinks: true,
    duration: 23,
    delay: -12,
  },
  {
    x: 46,
    y: 10,
    size: 120,
    colour: 'var(--pink-accent)',
    path: 'b',
    sinks: true,
    duration: 28,
    delay: -6,
  },
  {
    x: 20,
    y: 30,
    size: 80,
    colour: 'var(--sabre-left)',
    path: 'c',
    sinks: true,
    duration: 21,
    delay: -15,
  },
  {
    x: 58,
    y: 46,
    size: 90,
    colour: 'var(--sabre-right)',
    path: 'a',
    duration: 24,
    delay: -18,
  },
  {
    x: 2,
    y: 8,
    size: 130,
    colour: 'var(--purple-accent)',
    path: 'b',
    duration: 34,
    delay: -21,
  },
]

export function LavaBlobs() {
  return (
    <div class="lava" aria-hidden="true">
      {BLOBS.map((blob) => (
        <span
          class={`lava-blob lava-path-${blob.path}${blob.sinks ? ' lava-sinks' : ''}`}
          // eslint-disable-next-line @stylistic/max-len
          style={`top: ${blob.y}%; left: ${blob.x}%; width: ${blob.size}px; height: ${blob.size}px; background: ${blob.colour}; animation-duration: ${blob.duration}s; animation-delay: ${blob.delay}s;`}
        />
      ))}
    </div>
  )
}
