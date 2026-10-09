/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

// @ts-expect-error For the life of me shut the fuck up
import { createServer } from 'vite'
import * as sass from 'sass-embedded'
import * as fs from 'node:fs'
import * as path from 'node:path'

import solidPlugin from 'vite-plugin-solid'

console.log('[1/4] Compiling SCSS to CSS...')
const scssPath = path.resolve(process.cwd(), 'src/styles/main.scss')
const { css: compiledCss } = sass.compile(scssPath, {
  style: 'compressed',
  loadPaths: [ path.resolve(process.cwd(), 'src/styles') ],
})
console.log(`SCSS compiled successfully (~${(compiledCss.length / 1024).toFixed(2)} KiB).`)

console.log('[2/4] Rendering Solid JSX to static HTML...')
const vite = await createServer({
  configFile: false,
  plugins: [
    solidPlugin({
      ssr: true,
      solid: {
        generate: 'ssr',
        hydratable: false,
      },
    }),
  ],
  server: { middlewareMode: true },
  // opentype.js' CJS entry doesn't expose named exports to SSR, so we bundle its ESM build instead
  ssr: { noExternal: [ 'opentype.js' ] },
  appType: 'custom',
})

const { renderBio, renderLeadingCss } = await vite.ssrLoadModule('/src/render.ts')
const bioHtml = await renderBio()
const leadingCss: string = renderLeadingCss()
await vite.close()
console.log(`Solid component rendered to static HTML (~${(bioHtml.length / 1024).toFixed(2)} KiB).`)

console.log('[3/4] Preparing output files in dist/...')
const distDir = path.resolve(process.cwd(), 'dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

const css = leadingCss ? `${leadingCss}\n${compiledCss}` : compiledCss
const bioSnippet = `<style>\n${css}\n</style>\n${bioHtml}\n`
const snippetPath = path.join(distDir, 'bio-snippet.html')
fs.writeFileSync(snippetPath, bioSnippet, 'utf-8')
console.log(`Generated BeatLeader Bio snippet -> ${snippetPath}`)

const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BeatLeader Bio Preview</title>
  <style>
    body {
      margin: 0;
      padding: 30px 20px;
      background: #0f0d13;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
      transition: background 0.3s ease;
    }

    .preview-bar {
      margin-bottom: 24px;
      padding: 10px 18px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      font-size: 13px;
    }

    .preview-bar label {
      font-weight: 700;
      color: #ffb7d5;
    }

    .theme-select {
      background: #1e1828;
      color: #fff;
      border: 1px solid #ff85a2;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      outline: none;
    }

    .copy-btn {
      background: linear-gradient(135deg, #ff85a2 0%, #b892ff 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s;
    }

    .copy-btn:hover {
      transform: scale(1.04);
      opacity: 0.95;
    }

    .preview-container {
      width: 100%;
      max-width: 900px;
      padding: 20px;
      border-radius: 30px;
      transition: all 0.3s ease;
    }

    body.theme-mirror {
      background: linear-gradient(135deg, #2b1055, #7597de);
      background-attachment: fixed;
    }
    body.theme-mirror .preview-container {
      background: rgba(255, 255, 255, 0.05);
    }

    body.theme-flylight {
      background: #fdf2f4;
      color: #333;
    }
    body.theme-flylight .preview-bar {
      background: #ffffff;
      border-color: #ffd1dc;
      color: #333;
      box-shadow: 0 4px 20px rgba(235, 131, 163, 0.15);
    }
    body.theme-flylight .theme-select {
      background: #ffffff;
      color: #333;
    }
  </style>

  <style>
${css}
  </style>
</head>
<body class="reedark-theme">
  <div class="preview-bar">
    <label>BeatLeader Theme Simulator:</label>
    <select class="theme-select" id="themeSelect">
      <option value="reedark-theme">Dark Mode</option>
      <option value="flylight-theme">Flylight</option>
    </select>
    <button class="copy-btn" id="copyBtn">📋 Copy Bio HTML</button>
  </div>

  <div class="preview-container" id="previewContainer">
${bioHtml}
  </div>

  <textarea id="rawSnippet" style="display:none;">${bioSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>

  <script>
    const themeSelect = document.getElementById('themeSelect');
    const copyBtn = document.getElementById('copyBtn');
    const rawSnippet = document.getElementById('rawSnippet');

    themeSelect.addEventListener('change', (e) => {
      document.body.className = e.target.value;
      if (e.target.value === 'mirror-theme' || e.target.value === 'unbounded-theme') {
        document.body.classList.add('theme-mirror');
      } else if (e.target.value === 'flylight-theme') {
        document.body.classList.add('theme-flylight');
      }
    });

    copyBtn.addEventListener('click', () => {
      const tempArea = document.createElement('textarea');
      tempArea.value = rawSnippet.textContent;
      document.body.appendChild(tempArea);
      tempArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempArea);

      copyBtn.textContent = 'Copied to clipboard!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Bio HTML';
      }, 2000);
    });
  </script>
</body>
</html>`

const previewPath = path.join(distDir, 'index.html')
fs.writeFileSync(previewPath, previewHtml, 'utf-8')
console.log(`Generated Standalone Preview -> ${previewPath}`)
console.log('[4/4] Static build complete!')

