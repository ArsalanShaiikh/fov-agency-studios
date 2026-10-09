// QA: screenshot every section at every breakpoint and flag layout problems.
// Usage: node scripts/qa-screens.mjs [--url http://localhost:5419] [--out qa/shots]
//        [--widths 375,1440] [--sections top,work] [--reduced] [--full]
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]?.startsWith('--') || all[i + 1] === undefined ? true : all[i + 1]])
    return acc
  }, []),
)

const URL = args.url || 'http://localhost:5419/'
const OUT = path.resolve(args.out || 'qa/shots')
const VIEWPORTS = [
  [375, 812],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
  [3840, 2160],
].filter(([w]) => !args.widths || String(args.widths).split(',').map(Number).includes(w))
const SECTIONS = ['top', 'manifesto', 'services', 'work', 'process', 'open', 'contact'].filter(
  (s) => !args.sections || String(args.sections).split(',').includes(s),
)

function executablePath() {
  if (process.env.PW_CHROMIUM) return process.env.PW_CHROMIUM
  const bundled = chromium.executablePath()
  if (fs.existsSync(bundled)) return bundled
  const cache = path.join(process.env.HOME, 'Library/Caches/ms-playwright')
  const dir = fs.existsSync(cache) ? fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop() : null
  if (dir) {
    const mac = path.join(cache, dir, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')
    if (fs.existsSync(mac)) return mac
  }
  return undefined
}

fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({
  executablePath: executablePath(),
  args: ['--ignore-gpu-blocklist', '--use-angle=metal', '--enable-webgl'],
})

const report = []
for (const [width, height] of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: args.reduced ? 'reduce' : 'no-preference',
    hasTouch: width < 1024,
    isMobile: width < 768,
  })
  const page = await context.newPage()
  const logs = []
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`))

  await page.goto(URL, { waitUntil: 'load', timeout: 90000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(Number(args.settle || 3500))

  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const wide = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed' || r.width === 0) return false
        if (el.closest('[data-process-track], .rail, dialog, [aria-hidden="true"]')) return false
        if (el.parentElement?.closest('.overflow-hidden')) return false // clipped (e.g. pre-reveal scale)
        return r.right > vw + 1 || r.left < -1
      })
      .slice(0, 8)
      .map((el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 3).join('.')} [${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)}]`)
    return { scrollWidth: document.documentElement.scrollWidth, vw, wide }
  })

  for (const id of SECTIONS) {
    await page.evaluate((sel) => {
      const el = document.getElementById(sel)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'instant' })
    }, id)
    await page.waitForTimeout(Number(args.wait || 1400))
    await page.screenshot({ path: path.join(OUT, `${width}-${id}.jpg`), type: 'jpeg', quality: 70 })
  }

  if (args.full) {
    await page.screenshot({ path: path.join(OUT, `${width}-full.jpg`), type: 'jpeg', quality: 60, fullPage: true })
  }

  report.push({ width, height, horizontalOverflow: overflow.scrollWidth > overflow.vw, overflow, logs })
  await context.close()
}

await browser.close()
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2))
for (const r of report) {
  console.log(
    `${r.width}x${r.height}  overflow:${r.horizontalOverflow ? 'YES ' + r.overflow.scrollWidth : 'no'}  wide:${r.overflow.wide.length}  logs:${r.logs.length}`,
  )
  r.overflow.wide.forEach((w) => console.log('   wide ', w))
  r.logs.slice(0, 6).forEach((l) => console.log('   log  ', l.slice(0, 220)))
}
