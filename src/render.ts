/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import { renderToString } from 'solid-js/web'
import { Bio } from './components/Bio'
import { defaultBioConfig, type BioConfig } from './data/bioConfig'
import { fetchAllMapperAvatars } from './utils/mapperAvatars'

export async function renderBio(config: BioConfig = defaultBioConfig): Promise<string> {
  const mapperAvatars = await fetchAllMapperAvatars(config.favourites.mappers)
  return renderToString(() => Bio({
    config,
    mapperAvatars,
  }))
}

