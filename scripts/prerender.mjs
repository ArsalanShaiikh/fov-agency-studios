// Inject the server-rendered app into dist/index.html (run after both builds).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const ssrDir = path.resolve('dist-ssr')
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const html = render()
const file = path.join(dist, 'index.html')
const template = fs.readFileSync(file, 'utf8')
const placeholder = '<div id="root"></div>'
if (!template.includes(placeholder)) throw new Error('prerender: #root placeholder not found in dist/index.html')

fs.writeFileSync(file, template.replace(placeholder, `<div id="root">${html}</div>`))
fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: ${(html.length / 1024).toFixed(1)}KB of HTML injected into dist/index.html`)
