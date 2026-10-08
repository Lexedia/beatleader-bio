/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../../data/bioConfig'
import { fonts } from '../../data/fonts'
import { FontText } from '../FontText'

interface AboutPanelProps {
  about: BioConfig['about']
  fontRendering: BioConfig['fontRendering']
}

export function AboutPanel(props: AboutPanelProps) {
  return (
    <div class="tab-panel panel-1">
      <div class="quote-banner">
        {props.about.showQuoteIcon && (
          <span class="quote-icon">🌸</span>
        )}
        <p class="quote-text">{props.about.quote}</p>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-icon">✦</span>
            <span>
              <FontText
                font={fonts.stackSansNotch}
                mode={props.fontRendering}
                size={14}
                weight={600}
              >
                {props.about.introTitle}
              </FontText>
            </span>
          </div>
          <p class="card-text">{props.about.introText}</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-icon">🎀</span>
            <span>
              <FontText
                font={fonts.stackSansNotch}
                mode={props.fontRendering}
                size={14}
                weight={600}
              >
                Quick Facts
              </FontText>
            </span>
          </div>
          <div class="kv-list">
            {props.about.quickFacts.map((qf) => (
              <div class="kv-item">
                <span class="kv-key">{qf.label}</span>
                {qf.spoiler
                  ? (
                    <label class="kv-val spoiler" title="Click to reveal">
                      <input type="checkbox" class="reveal-toggle" />
                      <span class="spoiler-content">{qf.value}</span>
                    </label>
                  )
                  : <span class="kv-val">{qf.value}</span>}
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
              <span>
                <FontText
                  font={fonts.stackSansNotch}
                  mode={props.fontRendering}
                  size={14}
                  weight={600}
                >
                  {goal.title}
                </FontText>
              </span>
            </div>
            <p class="card-text">{goal.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
