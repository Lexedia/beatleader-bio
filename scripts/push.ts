/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

async function main() {

  if (fs.existsSync('.env')) {
    process.loadEnvFile('.env')
  }

  let cookie = process.env.BL_COOKIE
  const playerId = process.env.BL_PLAYER_ID ?? '76561198854909134'
  if (!cookie) {
    console.error('BL_COOKIE is not set. Add it to .env (see scripts/push.ts).')
    return 1
  }

  // we assume it's just the raw cookie and not it's k/v pair
  if (!cookie.startsWith('.AspNetCore.Cookies=')) {
    cookie = `.AspNetCore.Cookies=${cookie}`
  }

  const snippetPath = path.resolve(process.cwd(), 'dist/bio-snippet.html')
  if (!fs.existsSync(snippetPath)) {
    console.error(`${snippetPath} not found, run \`pnpm build\` first.`)
    return 1
  }

  const style = '<style>'

  const snippet = fs.readFileSync(snippetPath, 'utf-8')
  const styleEnd = snippet.indexOf('</style>')
  const css = snippet.slice(snippet.indexOf(style) + style.length, styleEnd).trim()
  const html = snippet.slice(styleEnd + '</style>'.length).trim()

  const body = `<style>body { color: white; } * { box-sizing: border-box; } body { margin: 0; }\n${css}\n</style><body>${html}</body>`

  console.log(`Pushing bio for ${playerId} (~${(body.length / 1024).toFixed(1)} KiB)...`)
  const res = await fetch(`https://api.beatleader.com/user/richbio?id=${playerId}`, {
    method: 'PUT',
    headers: {
      accept: '*/*',
      'content-type': 'text/plain;charset=UTF-8',
      cookie: cookie,
      origin: 'https://beatleader.com',
      referer: 'https://beatleader.com/',
    },
    body,
  })

  if (!res.ok) {
    console.error(`Failed: ${res.status} ${res.statusText}`)
    if (res.status === 401 || res.status === 403) {
      console.error('Cookie is probably expired, grab a new one.')
    }
    console.error(await res.text())
    return 1
  }

  console.log(`Done (${res.status}). https://beatleader.com/u/${playerId}`)
  return 0
}

process.exit(await main())
