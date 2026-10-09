// QA: automated accessibility scan (axe-core) at desktop, mobile and 200% zoom.
// Usage: node scripts/qa-axe.mjs [--url http://localhost:5419]
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const argv = process.argv.slice(2)
const URL = argv.includes('--url') ? argv[argv.indexOf('--url') + 1] : 'http://localhost:5419/'

function executablePath() {
  if (process.env.PW_CHROMIUM) return process.env.PW_CHROMIUM
  const bundled = chromium.executablePath()
  if (fs.existsSync(bundled)) return bundled
  const cache = path.join(process.env.HOME, 'Library/Caches/ms-playwright')
  const dir = fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop()
  return path.join(cache, dir, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')
}

const browser = await chromium.launch({ executablePath: executablePath() })
const runs = [
  { name: 'desktop 1440', viewport: { width: 1440, height: 900 } },
  { name: 'mobile 390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'zoom 200% (720)', viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 },
]
let total = 0
for (const run of runs) {
  const context = await browser.newContext(run)
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(4500)
  // Scroll through so every lazy/animated section has rendered once.
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(120)
  }
  await page.waitForTimeout(1500)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(800)
  await page.addScriptTag({ content: axeSource })
  const result = await page.evaluate(async () =>
    window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }),
  )
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  console.log(`\n== ${run.name}: ${result.violations.length} violation types, ${result.passes.length} passes, horizontal overflow: ${overflow}`)
  for (const v of result.violations) {
    total += v.nodes.length
    console.log(` [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`)
    v.nodes.slice(0, 3).forEach((n) => console.log(`     ${n.target.join(' ')}  ${(n.failureSummary || '').split('\n')[1]?.trim() ?? ''}`))
  }
  await context.close()
}
await browser.close()
console.log(`\nTotal violating nodes: ${total}`)
