/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../../data/bioConfig'
import { fonts } from '../../data/fonts'
import { FontText } from '../FontText'
import type { BioData } from '../../utils/bioData'
import { formatDuration } from '../../utils/format'

interface FavoritesPanelProps {
  favourites: BioConfig['favourites']
  data?: BioData
  fontRendering: BioConfig['fontRendering']
}

export function FavouritesPanel(props: FavoritesPanelProps) {
  return (
    <div class="tab-panel panel-3">
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-icon">⭐</span>
            <span>
              <FontText
                font={fonts.stackSansNotch}
                mode={props.fontRendering}
                size={14}
                weight={600}
              >
                Mappers
              </FontText>
            </span>
          </div>
          <div class="badges-list" style={{ 'margin-top': '4px' }}>
            {props.favourites.mappers.map((mapper) => {
              const avatar = props.data?.mapperAvatars[mapper]
              return (
                <span class="badge">
                  {avatar
                    ? <img class="badge-avatar" src={avatar} alt={mapper} loading="lazy" />
                    : <span>✦</span>
                  }
                  <a target="_blank" rel="noopener noreferrer" href={`https://beatsaver.com/profile/username/${mapper}`}>{mapper}</a>
                </span>
              )
            })}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-icon">🎵</span>
            <span>
              <FontText
                font={fonts.stackSansNotch}
                mode={props.fontRendering}
                size={14}
                weight={600}
              >
                Music Genres
              </FontText>
            </span>
          </div>
          <div class="badges-list" style={{ 'margin-top': '4px' }}>
            {props.favourites.genres.map((genre) => (
              <span class="badge">
                <span>🌸</span>
                <span>{genre}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 'margin-top': '8px' }} class="card">
        <div class="card-header">
          <span class="card-icon">💖</span>
          <span>
            <FontText
              font={fonts.stackSansNotch}
              mode={props.fontRendering}
              size={14}
              weight={600}
            >
              Maps
            </FontText>
          </span>
        </div>
        <div class="showcase-list">
          {props.favourites.topMaps.map((map) => {
            const info = props.data?.maps[map.bsr]
            return (
              <div class="showcase-item">
                <div class="item-left">
                  {info?.cover
                    ? <img class="map-cover" src={info.cover} alt={map.title} loading="lazy" />
                    : <span style={{ 'font-size': '16px' }}>🎶</span>}
                  <div>
                    <div class="item-title">{map.title}</div>
                    <div class="item-sub">
                      {map.artist} •
                      <a href={`https://beatsaver.com/maps/${map.bsr}`} target="_blank" rel="noopener noreferrer">
                        <code style={{ color: 'var(--pink-accent)' }}>!bsr {map.bsr}</code>
                      </a>
                    </div>
                    {info && (
                      <div class="item-sub">
                        {Math.round(info.bpm)} BPM • {formatDuration(info.duration)}
                      </div>
                    )}
                  </div>
                </div>
                <span class="item-pill">{map.diff}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
