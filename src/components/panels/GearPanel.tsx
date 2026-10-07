/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import type { BioConfig } from '../../data/bioConfig'

interface GearPanelProps {
  gear: BioConfig['gear'];
}

export function GearPanel(props: GearPanelProps) {
  return (
    <div class="tab-panel panel-2">
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-icon">🥽</span>
            <span>Hardware & Gear</span>
          </div>
          <div class="kv-list">
            <div class="kv-item">
              <span class="kv-key">Headset</span>
              <span class="kv-val">{props.gear.headset}</span>
            </div>
            <div class="kv-item">
              <span class="kv-key">Controllers</span>
              <span class="kv-val">{props.gear.controllers}</span>
            </div>
            <div class="kv-item">
              <span class="kv-key">Grip Style</span>
              <span class="kv-val">{props.gear.grip}</span>
            </div>
          </div>
        </div>

        {props.gear.reeSabers && (
          <div class="card reesabers-card">
            <div class="card-header">
              <span class="card-icon">⚔️</span>
              <span>ReeSabers</span>
            </div>
            {props.gear.reeSabers.previewUrl && (
              <div class="reesabers-preview">
                <img
                  src={props.gear.reeSabers.previewUrl}
                  alt={props.gear.reeSabers.name}
                  loading="lazy"
                />
              </div>
            )}
            <div class="reesabers-body">
              <div class="reesabers-name">{props.gear.reeSabers.name}</div>
              <div class="reesabers-author">
                <span class="reesabers-label">Original Author:</span>{' '}
                {props.gear.reeSabers.authorUrl ? (
                  <a
                    href={props.gear.reeSabers.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="reesabers-author-link"
                  >
                    {props.gear.reeSabers.author}
                  </a>
                ) : (
                  <span class="reesabers-author-name">{props.gear.reeSabers.author}</span>
                )}
              </div>
              <a
                href={props.gear.reeSabers.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="reesabers-download"
                download=""
              >
                <span>.reesabers</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
