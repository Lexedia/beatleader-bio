/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

interface SafeZone {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  weight: number
}

const STAR_CHARACTERS = [
  '✦',
  '✧',
  '★',
  '☆',
  '⋆',
  '⭒',
  '⭑',
  '✵',
  '✶',
  '✷',
  '✸',
  '⊹',
  '✱',
  '＊',
  '✳',
  '*',
  '⚝',
]

const STAR_COLORS = [
  'var(--pink-soft)',
  'var(--purple-soft)',
  'var(--pink-accent)',
  'var(--purple-accent)',
  'var(--pink-light)',
]

const SAFE_ZONES: SafeZone[] = [
  {
    xMin: 62,
    xMax: 96,
    yMin: 2.5,
    yMax: 16.5,
    weight: 3,
  },
  {
    xMin: 1.0,
    xMax: 4.5,
    yMin: 1.0,
    yMax: 6.0,
    weight: 1,
  },
  {
    xMin: 30,
    xMax: 60,
    yMin: 0.8,
    yMax: 3.2,
    weight: 1.5,
  },
  {
    xMin: 0.8,
    xMax: 3.2,
    yMin: 12,
    yMax: 88,
    weight: 2.5,
  },
  {
    xMin: 96.8,
    xMax: 99.2,
    yMin: 12,
    yMax: 88,
    weight: 2.5,
  },
  {
    xMin: 3.5,
    xMax: 22,
    yMin: 18.5,
    yMax: 25.5,
    weight: 2,
  },
  {
    xMin: 78,
    xMax: 96.5,
    yMin: 18.5,
    yMax: 25.5,
    weight: 2,
  },
  {
    xMin: 2.0,
    xMax: 18,
    yMin: 89,
    yMax: 96.5,
    weight: 2,
  },
  {
    xMin: 82,
    xMax: 98,
    yMin: 89,
    yMax: 96.5,
    weight: 2,
  },
  {
    xMin: 15,
    xMax: 85,
    yMin: 96.8,
    yMax: 99.2,
    weight: 2,
  },
  {
    xMin: 48.8,
    xMax: 51.2,
    yMin: 32,
    yMax: 82,
    weight: 1.5,
  },
]

function createPrng(seed: number = 69) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface StarItem {
  x: string
  y: string
  char: string
  size: number
  color: string
  opacity: string
  duration: string
  delay: string
  rotate: number
  spinDuration: string
  spinDirection: 'cw' | 'ccw'
}

function generateStars(count: number, seed: number = 69): StarItem[] {
  const rand = createPrng(seed)
  const spinRand = createPrng(seed + 44267)
  const totalWeight = SAFE_ZONES.reduce((sum, z) => sum + z.weight, 0)
  const placed: {
    x: number
    y: number
  }[] = []
  const stars: StarItem[] = []

  const minDist = 6.0

  for (let i = 0; i < count; i++) {
    let candidateX = 0
    let candidateY = 0
    let success = false
    let currentMinDist = minDist

    for (let attempt = 0; attempt < 60; attempt++) {
      let r = rand() * totalWeight
      let selectedZone = SAFE_ZONES[0]
      for (const zone of SAFE_ZONES) {
        if (r < zone.weight) {
          selectedZone = zone
          break
        }
        r -= zone.weight
      }

      const x = selectedZone.xMin + (rand() * (selectedZone.xMax - selectedZone.xMin))
      const y = selectedZone.yMin + (rand() * (selectedZone.yMax - selectedZone.yMin))

      const collides = placed.some((p) => {
        const dx = (p.x - x) * 1.25
        const dy = p.y - y
        return Math.sqrt((dx * dx) + (dy * dy)) < currentMinDist
      })

      if (!collides) {
        candidateX = x
        candidateY = y
        success = true
        break
      }

      if (attempt % 15 === 0 && attempt > 0) {
        currentMinDist *= 0.85
      }
    }

    if (!success) {
      const fallbackZone = SAFE_ZONES[i % SAFE_ZONES.length]
      candidateX = fallbackZone.xMin + (rand() * (fallbackZone.xMax - fallbackZone.xMin))
      candidateY = fallbackZone.yMin + (rand() * (fallbackZone.yMax - fallbackZone.yMin))
    }

    placed.push({
      x: candidateX,
      y: candidateY,
    })

    const char = STAR_CHARACTERS[Math.floor(rand() * STAR_CHARACTERS.length)]
    const color = STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)]
    const size = Math.round(11 + (rand() * 10))
    const opacity = (0.42 + (rand() * 0.43)).toFixed(2)
    const duration = (2.8 + (rand() * 2.7)).toFixed(2)
    const delay = (rand() * 4.0).toFixed(2)
    const rotate = Math.round((rand() - 0.5) * 40)
    const spinDuration = (spinRand() < 0.5 ? 20 + (spinRand() * 15) : 50 + (spinRand() * 30)).toFixed(1)
    const spinDirection = spinRand() < 0.5 ? 'cw' : 'ccw'

    stars.push({
      x: candidateX.toFixed(2),
      y: candidateY.toFixed(2),
      char,
      size,
      color,
      opacity,
      duration,
      delay,
      rotate,
      spinDuration,
      spinDirection,
    })
  }

  return stars
}

export interface StarsProps {
  n?: number
  seed?: number
}

export function Stars(props: StarsProps) {
  const count = props.n ?? 14
  const stars = generateStars(count, props.seed ?? 69)

  return (
    <div class="deco-stars" aria-hidden="true">
      {stars.map((star) => (
        <span class="deco-star" style={`top: ${star.y}%; left: ${star.x}%; transform: translate(-50%, -50%) rotate(${star.rotate}deg);`}>
          <span class={`deco-star-spin deco-star-spin-${star.spinDirection}`} style={`animation-duration: ${star.spinDuration}s;`}>
            <span
              class="deco-star-glyph"
              // eslint-disable-next-line @stylistic/max-len
              style={`font-size: ${star.size}px; color: ${star.color}; opacity: ${star.opacity}; animation-duration: ${star.duration}s; animation-delay: ${star.delay}s;`}
            >
              {star.char}
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}
