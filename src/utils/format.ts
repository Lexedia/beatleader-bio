/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

export const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`

const YOUTUBE_ID_PATTERN = /(?:youtu\.be\/|[?&]v=|\/(?:shorts|embed|live)\/)([\w-]{11})|^([\w-]{11})$/

export function youtubeId(url: string): string | undefined {
  const match = YOUTUBE_ID_PATTERN.exec(url.trim())
  return match?.[1] ?? match?.[2]
}
