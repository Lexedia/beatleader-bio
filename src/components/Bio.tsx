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
import { LavaBlobs } from './LavaBlobs'
import { Recursion, RecursionSwitch } from './Recursion'
import type { BioData } from '../utils/bioData'
import type { DrosteArt } from '../utils/droste'

interface BioProps {
  config?: BioConfig
  data?: BioData
  // Left out on the build's first pass, which is what the miniature gets drawn from
  droste?: DrosteArt
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
      <RecursionSwitch />
      <div class="backdrop" aria-hidden="true">
        <div class="aura aura-top-right"></div>
        <div class="aura aura-bottom-left"></div>
        <LavaBlobs />

        <Stars n={24} />
        <NoteCubes />
      </div>

      <div class="content">
        <Header profile={config().profile} fontRendering={config().fontRendering} />
        <Tabs config={config()} data={props.data} fontRendering={config().fontRendering} />
        <Socials socials={config().socials} />
      </div>

      {props.droste && <Recursion art={props.droste} />}
    </div>
  )
}
