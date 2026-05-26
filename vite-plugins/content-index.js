// Vite plugin: keeps the search index + content manifest in sync with
// the contents of content/*.md, and makes /content/<file> servable in
// both dev and prod builds.
//
// - buildStart: regenerates src/generated/contentManifest.js and
//   public/search-index.json once so the running config (and dev server)
//   sees fresh data.
// - configureServer: serves /content/<file> from project root in dev,
//   and triggers a full reload whenever a .md is added/changed/removed.
// - closeBundle: copies content/ into dist/content/ so production
//   deployments include the markdown the app fetches at runtime.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSearchIndex } from '../scripts/buildSearchIndex.mjs'

const __filename = fileURLToPath(import.meta.url)
const ROOT = path.resolve(path.dirname(__filename), '..')
const CONTENT_DIR = path.join(ROOT, 'content')

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

export default function contentIndexPlugin() {
  let isBuild = false
  let outDir = 'dist'

  return {
    name: 'dsa-content-index',

    config(_, env) {
      isBuild = env.command === 'build'
    },

    configResolved(resolved) {
      outDir = resolved.build?.outDir || 'dist'
    },

    async buildStart() {
      await buildSearchIndex({ silent: false })
    },

    configureServer(server) {
      // Serve /content/<file> from the project-root content/ directory
      // in dev. Vite's default static middleware only covers public/,
      // and we don't want to duplicate the content into public/.
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/content/')) return next()
        try {
          const rel = decodeURIComponent(req.url.replace(/^\/content\//, '').split('?')[0])
          // Reject any path traversal attempt.
          if (rel.includes('..')) return next()
          const filePath = path.join(CONTENT_DIR, rel)
          const data = await fs.readFile(filePath)
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.setHeader('Cache-Control', 'no-cache')
          res.end(data)
        } catch {
          next()
        }
      })

      // Rebuild index + full-reload whenever a .md under content/ changes.
      const watcher = server.watcher
      const onChange = async (file) => {
        if (!file.includes(`${path.sep}content${path.sep}`)) return
        if (!file.endsWith('.md')) return
        try {
          await buildSearchIndex({ silent: true })
          server.ws.send({ type: 'full-reload' })
        } catch (err) {
          server.config.logger.error(
            `[search-index] rebuild failed: ${err.message}`,
          )
        }
      }
      watcher.add(path.join(CONTENT_DIR, '**/*.md'))
      watcher.on('add', onChange)
      watcher.on('change', onChange)
      watcher.on('unlink', onChange)
    },

    async closeBundle() {
      if (!isBuild) return
      const destContent = path.join(ROOT, outDir, 'content')
      // Mirror content/ into dist/content/ so the deployed app can fetch
      // markdown by the same /content/<file> URLs it uses in dev.
      try {
        await fs.rm(destContent, { recursive: true, force: true })
        await copyDir(CONTENT_DIR, destContent)
      } catch (err) {
        this.warn(`failed to copy content/ into ${outDir}/: ${err.message}`)
      }
    },
  }
}
