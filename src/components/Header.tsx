/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../data/bioConfig'
import { fonts } from '../data/fonts'
import { FontText } from './FontText'

interface HeaderProps {
  profile: BioConfig['profile']
  fontRendering: BioConfig['fontRendering']
}

export function Header(props: HeaderProps) {
  return (
    <div class="header">
      <div class="avatar-container">
        <div class="avatar-frame">
          <img src={props.profile.avatarUrl} alt={props.profile.name} />
        </div>
        <div class="avatar-badge" title="Status">
          {props.profile.statusEmote}
        </div>
      </div>

      <div class="header-info">
        <div class="title-row">
          <h1 class="name">
            <FontText
              font={fonts.stackSansNotch}
              mode={props.fontRendering}
              size={20}
              weight={800}
              letterSpacing={-0.02}
              glint
            >
              {props.profile.name}
            </FontText>
          </h1>
          <span class="pronouns">
            <FontText
              font={fonts.stackSansNotch}
              mode={props.fontRendering}
              size={13}
              weight={600}
            >
              {props.profile.pronouns}
            </FontText>
          </span>
        </div>
        <p class="tagline">{props.profile.tagline}</p>

        <div class="badges-list">
          {props.profile.badges.map((b) => (
            <span class="badge">
              <span>{b.icon}</span>
              <span>
                <FontText
                  font={fonts.stackSansNotch}
                  mode={props.fontRendering}
                  size={14}
                  weight={600}
                >
                  {b.label}
                </FontText>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
