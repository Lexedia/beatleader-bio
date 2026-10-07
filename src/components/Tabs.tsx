/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../data/bioConfig'
import { AboutPanel } from './panels/AboutPanel'
import { GearPanel } from './panels/GearPanel'
import { FavouritesPanel } from './panels/FavouritesPanel'

interface TabsProps {
  config: BioConfig;
  mapperAvatars?: Record<string, string>;
}

export function Tabs(props: TabsProps) {
  return (
    <div class="tabset">
      <input type="radio" name="tab" id="tab-1" class="tab-radio" checked />
      <input type="radio" name="tab" id="tab-2" class="tab-radio" />
      <input type="radio" name="tab" id="tab-3" class="tab-radio" />

      <div class="tab-nav">
        <label for="tab-1" class="tab-label">
          <span class="tab-icon">✦</span>
          <span>About Me</span>
        </label>
        <label for="tab-2" class="tab-label">
          <span class="tab-icon">🌸</span>
          <span>Gear & Setup</span>
        </label>
        <label for="tab-3" class="tab-label">
          <span class="tab-icon">🎀</span>
          <span>Favourites</span>
        </label>
      </div>

      <div class="tab-panels">
        <AboutPanel about={props.config.about} />
        <GearPanel gear={props.config.gear} />
        <FavouritesPanel favourites={props.config.favourites} mapperAvatars={props.mapperAvatars} />
      </div>
    </div>
  )
}
