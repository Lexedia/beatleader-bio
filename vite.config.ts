/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [ solidPlugin() ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
