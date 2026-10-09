/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import { renderToString } from 'solid-js/web'
import { Bio } from './components/Bio'
import { defaultBioConfig, type BioConfig } from './data/bioConfig'
import { fetchBioData } from './utils/bioData'
import { googleFontsImport } from './data/fonts'

export async function renderBio(config: BioConfig = defaultBioConfig): Promise<string> {
  const data = await fetchBioData(config)
  return renderToString(() => Bio({
    config,
    data,
  }))
}


export function renderLeadingCss(fontRendering: BioConfig['fontRendering'] = defaultBioConfig.fontRendering): string {
  return fontRendering === 'google-fonts' ? googleFontsImport() : ''
}
