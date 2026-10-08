/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import { render } from 'solid-js/web'
import { Bio } from './components/Bio'
import { defaultBioConfig } from './data/bioConfig'
import { fetchBioData } from './utils/bioData'
import './styles/main.scss'

const root = document.getElementById('root')
if (root) {
  const data = await fetchBioData(defaultBioConfig)
  render(() => <Bio data={data} />, root)
}
