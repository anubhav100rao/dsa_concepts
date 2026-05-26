// Topics now live in YAML frontmatter at the top of each content/*.md.
// The build (scripts/buildSearchIndex.mjs, wired through vite-plugins/
// content-index.js) regenerates src/generated/contentManifest.js from
// the filesystem. To add a topic, drop a new <slug>.md into content/
// with a `---` frontmatter block — no edits here required.
export { default } from './generated/contentManifest.js'
