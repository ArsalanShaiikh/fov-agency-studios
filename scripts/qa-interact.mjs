// QA: interactions, keyboard and transitions.
// Usage: node scripts/qa-interact.mjs [--url http://localhost:5419] [--out qa/interact]
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const arg = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d)
const URL = arg('url', 'http://localhost:5419/')
const OUT = path.resolve(arg('out', 'qa/interact'))
fs.mkdirSync(OUT, { recursive: true })

function executablePath() {
  if (process.env.PW_CHROMIUM) return process.env.PW_CHROMIUM
  const bundled = chromium.executablePath()
  if (fs.existsSync(bundled)) return bundled
  const cache = path.join(process.env.HOME, 'Library/Caches/ms-playwright')
  const dir = fs.existsSync(cache) ? fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop() : null
  const mac = dir && path.join(cache, dir, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')
  return mac && fs.existsSync(mac) ? mac : undefined
}

const browser = await chromium.launch({ executablePath: executablePath(), args: ['--ignore-gpu-blocklist', '--use-angle=metal'] })
const shot = (page, name) => page.screenshot({ path: path.join(OUT, `${name}.jpg`), type: 'jpeg', quality: 72 })
const results = []
const check = (name, ok, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)

// ---------- Desktop ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await context.newPage()
  const logs = []
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(m.text()))
  page.on('pageerror', (e) => logs.push('pageerror ' + e.message))

  // Preloader sequence
  await page.goto(URL, { waitUntil: 'commit' })
  for (const t of [250, 900, 1700, 2500, 3400, 4600]) {
    await page.waitForTimeout(t - (results.lastT ?? 0))
    results.lastT = t
    await shot(page, `pre-${t}`)
  }
  delete results.lastT
  await page.waitForTimeout(1500)

  // Keyboard: walk the tab order
  await page.keyboard.press('Tab')
  const skip = await page.evaluate(() => document.activeElement?.textContent?.trim())
  check('first Tab lands on skip link', skip === 'Skip to content', `got "${skip}"`)
  await shot(page, 'kbd-skip')
  const order = []
  let missingRing = 0
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement
      const cs = getComputedStyle(el)
      const ring = el === document.body || (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0)
      const label = (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40)
      return { tag: el.tagName.toLowerCase(), label, ring }
    })
    if (!info.ring) missingRing++
    order.push(`${info.tag}:${info.label}${info.ring ? '' : ' (NO RING)'}`)
  }
  fs.writeFileSync(path.join(OUT, 'tab-order.txt'), order.join('\n'))
  check('visible focus ring on every tab stop (first 40)', missingRing === 0, `${missingRing} without ring`)
  await shot(page, 'kbd-mid')

  // Work: hover focus + project overlay
  await page.evaluate(() => {
    const el = document.getElementById('work')
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + 120, behavior: 'instant' })
  })
  await page.waitForTimeout(2200)
  const media = page.locator('[data-media]').first()
  const box = await media.boundingBox()
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.45, { steps: 8 })
  await page.waitForTimeout(1200)
  await shot(page, 'work-hover')
  await media.click()
  await page.waitForTimeout(450)
  await shot(page, 'overlay-mid')
  await page.waitForTimeout(1500)
  await shot(page, 'overlay-open')
  check('project overlay opens and hash updates', (await page.evaluate(() => location.hash)) === '#work/halden-audio')
  check('focus moves into overlay', await page.evaluate(() => !!document.activeElement.closest('dialog[open]')))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1300)
  check('Esc closes overlay', await page.evaluate(() => !document.querySelector('dialog[open]')))
  await page.goBack().catch(() => {})
  await page.waitForTimeout(300)

  // Slider via keyboard
  await page.evaluate(() => {
    const el = document.querySelector('[data-dolly-view]')
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 120, behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.focus('input[type="range"]')
  for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(900)
  const out = await page.evaluate(() => document.querySelector('output')?.textContent)
  check('lens slider works by keyboard', /°/.test(out ?? '') && !out.startsWith('30.0'), out)
  await shot(page, 'slider')

  // Copy email + credits
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
  await page.waitForTimeout(2200)
  await page.getByRole('button', { name: 'Copy email' }).click()
  await page.waitForTimeout(250)
  check('copy email shows Copied', (await page.getByRole('button', { name: 'Copied' }).count()) === 1)
  await shot(page, 'endcard')
  await page.getByRole('button', { name: 'Credits' }).click()
  await page.waitForTimeout(400)
  await shot(page, 'credits')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  check('credits dialog closes on Esc', await page.evaluate(() => !document.querySelector('dialog[open]')))

  check('no console errors or warnings (desktop)', logs.length === 0, logs.slice(0, 3).join(' | '))
  await context.close()
}

// ---------- Mobile ----------
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  const page = await context.newPage()
  const logs = []
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(m.text()))
  page.on('pageerror', (e) => logs.push('pageerror ' + e.message))
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(4500)
  await page.getByRole('button', { name: 'Menu' }).tap()
  await page.waitForTimeout(1300)
  await shot(page, 'm-menu')
  check('mobile menu opens', await page.evaluate(() => !!document.querySelector('#menu[open]')))
  await page.getByRole('button', { name: 'Close' }).tap()
  await page.waitForTimeout(1100)
  check('mobile menu closes', await page.evaluate(() => !document.querySelector('#menu[open]')))
  const targets = await page.evaluate(() =>
    [...document.querySelectorAll('a, button, input')]
      .filter((el) => el.offsetParent && !el.closest('dialog') && !el.classList.contains('sr-only'))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && (r.height < 24 || r.width < 24)).length,
  )
  check('tap targets at least 24px', targets === 0, `${targets} small targets`)
  check('no console errors or warnings (mobile)', logs.length === 0, logs.slice(0, 3).join(' | '))
  await context.close()
}

await browser.close()
fs.writeFileSync(path.join(OUT, 'results.txt'), results.join('\n'))
console.log(results.join('\n'))
