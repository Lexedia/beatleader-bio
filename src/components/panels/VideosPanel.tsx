/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../../data/bioConfig'
import { fonts } from '../../data/fonts'
import { FontText } from '../FontText'
import type { BioData } from '../../utils/bioData'
import { youtubeId } from '../../utils/format'
import { VideoIcon } from '../VideoIcon'

interface VideosPanelProps {
  videos: BioConfig['videos']
  data?: BioData
  fontRendering: BioConfig['fontRendering']
}

export function VideosPanel(props: VideosPanelProps) {
  return (
    <div class="tab-panel panel-4">
      <div class="card">
        <div class="card-header">
          <span class="card-icon"><VideoIcon /></span>
          <span>
            <FontText
              font={fonts.stackSansNotch}
              mode={props.fontRendering}
              size={14}
              weight={600}
            >
              Videos
            </FontText>
          </span>
        </div>
        <div class={props.videos.length === 1 ? 'video-grid video-grid-single' : 'video-grid'}>
          {props.videos.map((video) => {
            const id = youtubeId(video.url)
            if (!id)
              return null

            const info = props.data?.videos[id]
            return (
              <a class="video-card" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
                <span class="video-thumb">
                  <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={info?.title ?? 'YouTube video'} loading="lazy" />
                  <span class="video-play">▶</span>
                </span>
                <span class="video-meta">
                  <span class="item-title">{info?.title ?? 'Watch on YouTube'}</span>
                  {info && <span class="item-sub">{info.channel}</span>}
                  {video.note && <span class="item-sub">{video.note}</span>}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
