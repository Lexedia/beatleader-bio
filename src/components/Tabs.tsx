/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../data/bioConfig'
import { AboutPanel } from './panels/AboutPanel'
import { GearPanel } from './panels/GearPanel'
import { FavouritesPanel } from './panels/FavouritesPanel'
import { VideosPanel } from './panels/VideosPanel'
import { VideoIcon } from './VideoIcon'
import { fonts } from '../data/fonts'
import { FontText } from './FontText'
import type { BioData } from '../utils/bioData'

interface TabsProps {
  config: BioConfig
  data?: BioData
  fontRendering: BioConfig['fontRendering']
}

export function Tabs(props: TabsProps) {
  const hasVideos = props.config.videos.length > 0

  return (
    <div class="tabset">
      <input type="radio" name="tab" id="tab-1" class="tab-radio" checked />
      <input type="radio" name="tab" id="tab-2" class="tab-radio" />
      <input type="radio" name="tab" id="tab-3" class="tab-radio" />
      {hasVideos && <input type="radio" name="tab" id="tab-4" class="tab-radio" />}

      <div class="tab-nav">
        <label for="tab-1" class="tab-label">
          <span class="tab-icon">✦</span>
          <span>
            <FontText
              font={fonts.teko}
              mode={props.fontRendering}
              size={17}
              weight={700}
            >
              About Me
            </FontText>
          </span>
        </label>
        <label for="tab-2" class="tab-label">
          <span class="tab-icon">🌸</span>
          <span>
            <FontText
              font={fonts.teko}
              mode={props.fontRendering}
              size={17}
              weight={700}
            >
              Gear & Setup
            </FontText>
          </span>
        </label>
        <label for="tab-3" class="tab-label">
          <span class="tab-icon">🎀</span>
          <span>
            <FontText
              font={fonts.teko}
              mode={props.fontRendering}
              size={17}
              weight={700}
            >
              Favourites
            </FontText>
          </span>
        </label>
        {hasVideos && (
          <label for="tab-4" class="tab-label">
            <span class="tab-icon"><VideoIcon /></span>
            <span>
              <FontText
                font={fonts.teko}
                mode={props.fontRendering}
                size={17}
                weight={700}
              >
                Videos
              </FontText>
            </span>
          </label>
        )}
      </div>

      <div class="tab-panels">
        <AboutPanel about={props.config.about} fontRendering={props.config.fontRendering} />
        <GearPanel gear={props.config.gear} fontRendering={props.config.fontRendering} />
        <FavouritesPanel favourites={props.config.favourites} data={props.data} fontRendering={props.config.fontRendering} />
        {hasVideos && <VideosPanel videos={props.config.videos} data={props.data} fontRendering={props.config.fontRendering} />}
      </div>
    </div>
  )
}
