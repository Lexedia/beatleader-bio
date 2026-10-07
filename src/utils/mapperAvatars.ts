/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

export type MapperAvatarMap = Record<string, string>

/**
 * Fetch avatar URL for a BeatSaver mapper by their username.
 */
export async function fetchBeatSaverAvatar(username: string): Promise<string | null> {
  const cleanName = username.trim()
  if (!cleanName)
    return null

  try {
    const response = await fetch(
      `https://api.beatsaver.com/users/name/${encodeURIComponent(cleanName)}`,
      {
        headers: {
          'User-Agent': 'BeatLeader-Bio/1.0',
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok)
      return null

    const data = (await response.json()) as { avatar?: string }
    return typeof data.avatar === 'string' && data.avatar ? data.avatar : null
  } catch (_) {
    return null
  }
}

export async function fetchAllMapperAvatars(usernames: string[]): Promise<MapperAvatarMap> {
  const result: MapperAvatarMap = {}

  const fetches = usernames.map(async (name) => {
    const avatar = await fetchBeatSaverAvatar(name)
    if (avatar) {
      result[name] = avatar
    }
  })

  await Promise.allSettled(fetches)
  return result
}
