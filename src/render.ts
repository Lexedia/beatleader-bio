/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import { renderToString } from 'solid-js/web'
import { Bio } from './components/Bio'
import { defaultBioConfig, type BioConfig } from './data/bioConfig'
import { fetchBioData, type BioData } from './utils/bioData'
import type { DrosteArt } from './utils/droste'
import { googleFontsImport } from './data/fonts'

let data: Promise<BioData> | undefined

export async function renderBio(config: BioConfig = defaultBioConfig, droste?: DrosteArt): Promise<string> {
  data ??= fetchBioData(config)
  const bioData = await data
  return renderToString(() => Bio({
    config,
    data: bioData,
    droste,
  }))
}

export function recursiveLinkName(config: BioConfig = defaultBioConfig): string | undefined {
  return config.socials.find((social) => social.recursive)?.name
}

export function renderLeadingCss(fontRendering: BioConfig['fontRendering'] = defaultBioConfig.fontRendering): string {
  return fontRendering === 'google-fonts' ? googleFontsImport() : ''
}

export function assetsUrl(config: BioConfig = defaultBioConfig): string {
  return config.assetsUrl
}
