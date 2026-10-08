/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import { defaultBioConfig, type BioConfig } from '../data/bioConfig'
import { fontFaceCss } from '../data/fonts'
import { Header } from './Header'
import { Tabs } from './Tabs'
import { Socials } from './Socials'
import { Stars } from './Stars'
import { NoteCubes } from './NoteCubes'
import type { BioData } from '../utils/bioData'

interface BioProps {
  config?: BioConfig
  data?: BioData
}

export function Bio(props: BioProps) {
  const config = () => props.config || defaultBioConfig

  return (
    <div
      class="bl-bio"
      style={{
        '--sabre-left': config().sabreColours.left,
        '--sabre-right': config().sabreColours.right,
      }}
    >
      {config().fontRendering === 'font-face' && <style>{fontFaceCss()}</style>}
      <div class="aura aura-top-right"></div>
      <div class="aura aura-bottom-left"></div>
      <div class="blob blob-pink"></div>
      <div class="blob blob-purple"></div>

      <Stars n={24} />
      <NoteCubes />

      <div class="content">
        <Header profile={config().profile} fontRendering={config().fontRendering} />
        <Tabs config={config()} data={props.data} fontRendering={config().fontRendering} />
        <Socials socials={config().socials} />
      </div>
    </div>
  )
}
