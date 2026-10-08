/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../data/bioConfig'
import { fetchAllMapperAvatars, type MapperAvatarMap } from './mapperAvatars'
import { youtubeId } from './format'

export interface MapInfo {
  cover: string
  bpm: number
  duration: number
}

export interface VideoInfo {
  title: string
  channel: string
}

export interface BioData {
  mapperAvatars: MapperAvatarMap
  maps: Record<string, MapInfo>
  videos: Record<string, VideoInfo>
}

async function fetchMapInfo(bsr: string): Promise<MapInfo | undefined> {
  try {
    const res = await fetch(`https://api.beatsaver.com/maps/id/${encodeURIComponent(bsr)}`, {
      headers: {
        'User-Agent': 'BeatLeader-Bio/1.0',
        Accept: 'application/json',
      },
    })
    if (!res.ok)
      return undefined

    const map = (await res.json()) as {
      metadata: {
        bpm: number
        duration: number
      }
      versions: { coverURL: string }[]
    }
    return {
      cover: map.versions[0]?.coverURL,
      bpm: map.metadata.bpm,
      duration: map.metadata.duration,
    }
  } catch (_) {
    return undefined
  }
}

async function fetchVideoInfo(id: string): Promise<VideoInfo | undefined> {
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${id}`
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`)
    if (!res.ok)
      return undefined

    const video = (await res.json()) as {
      title: string
      author_name: string
    }
    return {
      title: video.title,
      channel: video.author_name,
    }
  } catch (_) {
    return undefined
  }
}

export async function fetchBioData(config: BioConfig): Promise<BioData> {
  const bsrs = config.favourites.topMaps.map((m) => m.bsr)
  const videoIds = config.videos.map((v) => youtubeId(v.url)).filter((id) => id !== undefined)
  const [
    mapperAvatars,
    mapInfos,
    videoInfos,
  ] = await Promise.all([
    fetchAllMapperAvatars(config.favourites.mappers),
    Promise.all(bsrs.map(fetchMapInfo)),
    Promise.all(videoIds.map(fetchVideoInfo)),
  ])

  const maps: Record<string, MapInfo> = {}
  bsrs.forEach((bsr, i) => {
    const info = mapInfos[i]
    if (info)
      maps[bsr] = info
  })

  const videos: Record<string, VideoInfo> = {}
  videoIds.forEach((id, i) => {
    const info = videoInfos[i]
    if (info)
      videos[id] = info
  })

  return {
    mapperAvatars,
    maps,
    videos,
  }
}
