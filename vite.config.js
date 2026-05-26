import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import contentIndex from './vite-plugins/content-index.js'

export default defineConfig({
  plugins: [react(), contentIndex()],
  assetsInclude: ['**/*.md'],
})
