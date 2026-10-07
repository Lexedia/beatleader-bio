/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import { defaultBioConfig, type BioConfig } from '../data/bioConfig'
import { Header } from './Header'
import { Tabs } from './Tabs'
import { Socials } from './Socials'
import { Stars } from './Stars'

interface BioProps {
  config?: BioConfig;
  mapperAvatars?: Record<string, string>;
}

export function Bio(props: BioProps) {
  const config = () => props.config || defaultBioConfig

  return (
    <div class="bl-bio">
      <div class="aura aura-top-right"></div>
      <div class="aura aura-bottom-left"></div>

      <Stars n={10} />

      <div class="content">
        <Header profile={config().profile} />
        <Tabs config={config()} mapperAvatars={props.mapperAvatars} />
        <Socials socials={config().socials} />
      </div>
    </div>
  )
}
