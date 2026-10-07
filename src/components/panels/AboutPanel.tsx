/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../../data/bioConfig'

interface AboutPanelProps {
  about: BioConfig['about'];
}

export function AboutPanel(props: AboutPanelProps) {
  return (
    <div class="tab-panel panel-1">
      <div class="quote-banner">
        <span class="quote-icon">🌸</span>
        <p class="quote-text">{props.about.quote}</p>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-icon">✦</span>
            <span>{props.about.introTitle}</span>
          </div>
          <p class="card-text">{props.about.introText}</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-icon">🎀</span>
            <span>Quick Facts</span>
          </div>
          <div class="kv-list">
            {props.about.quickFacts.map((qf) => (
              <div class="kv-item">
                <span class="kv-key">{qf.label}</span>
                <span class="kv-val">{qf.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 'margin-top': '8px' }} class="grid-2">
        {props.about.goals.map((goal) => (
          <div class="card">
            <div class="card-header">
              <span class="card-icon">{goal.icon}</span>
              <span>{goal.title}</span>
            </div>
            <p class="card-text">{goal.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
