/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../data/bioConfig'

interface HeaderProps {
  profile: BioConfig['profile'];
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
          <h1 class="name">{props.profile.name}</h1>
          <span class="pronouns">{props.profile.pronouns}</span>
        </div>
        <p class="tagline">{props.profile.tagline}</p>

        <div class="badges-list">
          {props.profile.badges.map((b) => (
            <span class="badge">
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
