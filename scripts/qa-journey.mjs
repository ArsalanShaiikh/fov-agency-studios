// QA: capture the whole scroll journey as evenly spaced frames.
// Usage: node scripts/qa-journey.mjs [--url http://localhost:5419] [--w 1440] [--h 900]
//        [--steps 24] [--out qa/journey] [--reduced] [--mobile]
import { chromium, devices } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`)
  if (i === -1) return d
  const v = argv[i + 1]
  return v === undefined || v.startsWith('--') ? true : v
}

const URL = arg('url', 'http://localhost:5419/')
const OUT = path.resolve(arg('out', 'qa/journey'))
const STEPS = Number(arg('steps', 24))
const mobile = arg('mobile', false)
const W = Number(arg('w', mobile ? 390 : 1440))
const H = Number(arg('h', mobile ? 844 : 900))

function executablePath() {
  if (process.env.PW_CHROMIUM) return process.env.PW_CHROMIUM
  const bundled = chromium.executablePath()
  if (fs.existsSync(bundled)) return bundled
  const cache = path.join(process.env.HOME, 'Library/Caches/ms-playwright')
  const dir = fs.existsSync(cache) ? fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop() : null
  const mac = dir && path.join(cache, dir, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')
  return mac && fs.existsSync(mac) ? mac : undefined
}

fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({
  executablePath: executablePath(),
  args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--enable-webgl'],
})
const context = await browser.newContext({
  ...(mobile ? devices['iPhone 13'] : {}),
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  reducedMotion: arg('reduced', false) ? 'reduce' : 'no-preference',
})
const page = await context.newPage()
const logs = []
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`${m.type()}: ${m.text()}`))
page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`))

await page.goto(URL, { waitUntil: 'load', timeout: 90000 })
await page.waitForTimeout(Number(arg('settle', 5000)))
await page.screenshot({ path: path.join(OUT, `00.jpg`), type: 'jpeg', quality: 72 })

const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
for (let i = 1; i <= STEPS; i++) {
  const y = Math.round((max * i) / STEPS)
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await page.waitForTimeout(Number(arg('wait', 1600)))
  await page.screenshot({ path: path.join(OUT, `${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 72 })
}

const metrics = await page.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  canvas: !!document.querySelector('[data-scene] canvas'),
  webglMedia: document.documentElement.hasAttribute('data-webgl-media'),
}))
fs.writeFileSync(path.join(OUT, 'log.json'), JSON.stringify({ metrics, logs }, null, 2))
console.log(JSON.stringify(metrics))
logs.slice(0, 15).forEach((l) => console.log('  ', l.slice(0, 260)))
await browser.close()
