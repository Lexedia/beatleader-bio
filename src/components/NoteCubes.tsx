/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

/* eslint-disable @stylistic/max-len */


interface Cube {
  x: number
  y: number
  hand: 'left' | 'right'
  direction?: number
  size: number
  duration: number
  delay: number
}

const CUBES: Cube[] = [
  {
    x: 74,
    y: 7,
    hand: 'right',
    direction: 72,
    size: 24,
    duration: 9,
    delay: 0,
  },
  {
    x: 93,
    y: 12,
    hand: 'left',
    direction: 135,
    size: 20,
    duration: 11,
    delay: -3,
  },
  {
    x: 3,
    y: 32,
    hand: 'left',
    direction: 90,
    size: 22,
    duration: 10,
    delay: -6,
  },
  {
    x: 97,
    y: 30,
    hand: 'right',
    size: 20,
    duration: 12,
    delay: -2,
  },
  {
    x: 6,
    y: 93,
    hand: 'right',
    direction: 225,
    size: 22,
    duration: 9.5,
    delay: -5,
  },
  {
    x: 97,
    y: 95,
    hand: 'left',
    direction: 180,
    size: 24,
    duration: 10.5,
    delay: -7,
  },
]

interface ChainLink {
  gap: number
  bend?: number
}

interface Chain {
  x: number
  y: number
  hand: 'left' | 'right'
  direction: number
  size: number
  headHeight: number
  links: ChainLink[]
  duration: number
  delay: number
}

const CHAINS: Chain[] = [
  {
    x: 40,
    y: 7,
    hand: 'left',
    direction: -65,
    size: 22,
    headHeight: 15,
    links: [
      { gap: 16 },
      {
        gap: 13,
        bend: 6,
      },
      {
        gap: 11,
        bend: 8,
      },
      {
        gap: 12,
        bend: 10,
      },
    ],
    duration: 11.5,
    delay: -4,
  },
]

interface PlacedLink {
  x: number
  y: number
  heading: number
}

function placeLinks(links: ChainLink[]): PlacedLink[] {
  let x = 0
  let y = 0
  let heading = 0

  return links.map((link) => {
    heading += link.bend ?? 0
    const radians = heading * Math.PI / 180
    x -= Math.sin(radians) * link.gap
    y += Math.cos(radians) * link.gap
    return {
      x: +(x.toFixed(2)),
      y: +(y.toFixed(2)),
      heading,
    }
  })
}

function NoteArrow(props: { width?: number }) {
  const width = props.width ?? 14
  return (
    <svg class="note-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 5.5" width={width} height={Number((width * 5.5 / 14).toFixed(2))}>
      <path d="M1.7 0.7L12.3 0.7Q13.4 0.7 12.48 1.3L7.92 4.3Q7 4.9 6.08 4.3L1.52 1.3Q0.6 0.7 1.7 0.7Z" />
    </svg>
  )
}

export function NoteCubes() {
  return (
    <div class="note-cubes" aria-hidden="true">
      {CUBES.map((cube) => (
        <span
          class={`note-cube note-${cube.hand}`}
          style={`top: ${cube.y}%; left: ${cube.x}%; width: ${cube.size}px; height: ${cube.size}px; animation-duration: ${cube.duration}s; animation-delay: ${cube.delay}s;`}
        >
          <span class="note-body" style={`transform: rotate(${cube.direction ?? 0}deg);`}>
            {cube.direction === undefined
              ? <span class="note-dot" />
              : <NoteArrow />}
          </span>
        </span>
      ))}
      {CHAINS.map((chain) => (
        <span
          class={`note-cube note-chain note-${chain.hand}`}
          style={`top: ${chain.y}%; left: ${chain.x}%; width: ${chain.size}px; height: ${chain.size}px; animation-duration: ${chain.duration}s; animation-delay: ${chain.delay}s;`}
        >
          <span class="note-chain-body" style={`transform: rotate(${chain.direction}deg);`}>
            <span class="note-body note-chain-head" style={`width: ${chain.size}px; height: ${chain.headHeight}px;`}>
              <NoteArrow width={Math.round(chain.size * 0.6)} />
            </span>
            {placeLinks(chain.links).map((link) => (
              <span
                class="note-link"
                style={`width: ${chain.size}px; height: ${Math.round(chain.size * 0.32)}px; transform: translate(-50%, -50%) translate(${link.x}px, ${link.y}px) rotate(${link.heading}deg);`}
              >
                <span class="note-dot" />
              </span>
            ))}
          </span>
        </span>
      ))}
    </div>
  )
}
