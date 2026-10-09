# FOV: Design Direction (Iteration 1)

Status: approved 2026-10-10 (see §12 for the decisions). Building.
Research behind these decisions: [RESEARCH.md](./RESEARCH.md).

> **Naming rule:** the brand is only ever "FOV". The letters are never expanded, in the site
> copy, in code comments or in these docs.

---

## 1. The concept: "The Lens"

**The site is a camera, and the visitor is operating it.** Every scroll is a lens move: the view
widens, racks focus, pans, and finally narrows back onto one frame. Behind the page sits one
continuous 3D space built from frames inside frames, one for every screen format we make work for
(2.39:1 cinema, 16:9, 4:5, 1:1, 9:16), so the screen reads as a window into a place rather than a
page of content. Everything else (type, cursor, transitions, loading) borrows the same camera
grammar: framing, focus, exposure and the cut. It is dark like a screening room, with one signal
yellow taken from the black-and-yellow taxis of the city we work from.

**The one thing people will remember:** a scroll-driven *dolly zoom* (the "Vertigo" shot). The
FOV wordmark holds perfectly still while the world behind it stretches from a flat telephoto
graphic into a deep tunnel. A live readout shows the camera's actual lens angle changing from
8° to 78°. The brand name becomes the instrument.

**Design read:** a creative-studio portfolio for brand and marketing leads, in an
Awwwards-experimental language built on WebGL scrollytelling, kinetic type and camera language.
Dials: `DESIGN_VARIANCE 8 / MOTION_INTENSITY 8 / VISUAL_DENSITY 3`.

### Why this direction (from research)

- The strongest studio sites own **one idea and push it all the way through** (Igloo's descent,
  Dogstudio's single model, Obys's framing index). A camera metaphor is the most honest idea
  available to us: the name *is* a camera term, and all three services (3D, motion, video) are
  made through a virtual or real lens.
- Most 3D studio sites put a hero object on a stage. Ours makes **the camera** the subject, and
  that lets the 3D drive the DOM instead of sitting behind it: focus, framing and lens changes
  touch both layers at once.
- The common patterns we're avoiding on purpose are a 0-100 counter preloader, "Play reel"
  split text, "Click to start" sound gates, decorative HUD clutter and giant serif manifestos.
  See RESEARCH.md §4.

---

## 2. Colour

One theme for the whole page (dark), with **one deliberate colour-block flip** at the very end
(the contact end-card), where the "lights come on". There is no light/dark toggle in iteration 1.
The site is a screening room by design (see §11, overrides).

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0B0B0A` | Page background, 3D fog colour, text on signal |
| `--ink-2` | `#141413` | Raised surfaces (Open tiles, overlays) |
| `--paper` | `#E9E8E4` | Primary text, 3D frame lines |
| `--smoke` | `#8C8A85` | Secondary text, metadata |
| `--line` | `rgb(233 232 228 / 0.14)` | Hairlines, inactive brackets (non-text) |
| `--signal` | `#E9C440` | The only accent: focus lock, active states, end-card ground |
| `--signal-ink-soft` | `#4A4020` | Secondary text on signal |

**Contrast (WCAG 2.2):**

| Pair | Ratio | Passes |
|---|---|---|
| paper on ink | 16.1:1 | AAA |
| smoke on ink | 5.7:1 | AA body |
| smoke on ink-2 | 5.4:1 | AA body |
| signal on ink | 11.7:1 | AAA |
| ink on signal | 11.7:1 | AAA |
| signal-ink-soft on signal | 6.1:1 | AA body |

**Rules**
- Signal yellow is rationed. It marks *what is in focus* (the active service, the focused word,
  the cursor's focus lock, keyboard focus) and the end-card. It is never decoration, never a
  gradient and never a glow.
- No pure black or pure white anywhere, including in shaders (fog uses `--ink`, lines use
  `--paper`).
- The 3D palette uses the same tokens. The only extra is the warm-white "window" at the end of
  the tunnel (`#FFF4D6`), which is light, not UI colour.

---

## 3. Typography

| Role | Family | Source | Licence |
|---|---|---|---|
| Wordmark, display, service names, end-card | **Panchang** (Variable, used at 700-800) | [Fontshare](https://www.fontshare.com/fonts/panchang), by Indian Type Foundry | ITF Free Font License v2.0 |
| Text, manifesto, UI | **Switzer** (Variable, 400-600) | [Fontshare](https://www.fontshare.com/fonts/switzer), by Indian Type Foundry | ITF Free Font License v2.0 |
| Camera readouts, metadata, code | **Geist Mono** (400-500) | [Vercel / Fontsource](https://fontsource.org/fonts/geist-mono) | SIL Open Font License 1.1 |

**Why this pairing.** Panchang is an ultra-wide geometric sans, so "FOV" set in it literally looks
like a wide-angle, widescreen frame (see the specimen in RESEARCH.md §5). Switzer is a narrower,
quiet neo-grotesk that keeps long text readable next to it. Geist Mono carries the "instrument"
voice (focal lengths, FOV degrees, timecode, Mumbai time). Both display and text faces come from
an Indian foundry, which is a local signal with substance behind it rather than decoration.

**Licence notes (verified 2026-10-10 against FFL v2.0, 17 Aug 2026):**
- Commercial use and self-hosting via `@font-face` on our own site are explicitly permitted.
  Wordmarks made with the font may be trademarked.
- **No modification of the files**, which includes subsetting and format conversion. We ship
  the official WOFF2 files exactly as downloaded.
- **No redistribution through public repositories.** If this repo is ever made public, the
  Fontshare files must be excluded from git and fetched at build time (or loaded through the
  Fontshare API). Geist Mono (OFL) has no such restriction.
- We may not hand the font files to clients; they must download their own copy.

**Type scale (fluid, 375 → ~3400px, then holds)**

| Token | Value | Use |
|---|---|---|
| `--fs-wordmark` | `clamp(6rem, 17vw + 1rem, 28rem)` (portrait: stacked F / O / V at `30vw`) | Hero "FOV" |
| `--fs-display` | `clamp(2rem, 0.8rem + 4.6vw, 11rem)` (Panchang is ~0.9em per glyph) | Service names, process verbs, end-card |
| `--fs-h2` | `clamp(2.25rem, 1rem + 4.5vw, 10rem)` | Section headings |
| `--fs-manifesto` | `clamp(2rem, 0.9rem + 3.6vw, 8.5rem)` | Mission |
| `--fs-lead` | `clamp(1.125rem, 0.95rem + 0.55vw, 2.25rem)` | Vision line, intros |
| `--fs-body` | `clamp(1rem, 0.95rem + 0.2vw, 1.5rem)` | Body |
| `--fs-mono` | `clamp(0.75rem, 0.7rem + 0.15vw, 1.125rem)` | Readouts, metadata |

**Rules**
- Panchang only at display sizes and only for short strings (≤ 3 words per line). It is never
  used for paragraphs. Sentence case, no tracking change.
- Switzer headlines: weight 500, `letter-spacing: -0.03em`, `line-height: 1.02`. Body: weight
  400, `line-height: 1.5`, max `62ch`.
- Mono: uppercase only for readouts, `letter-spacing: 0.04em`. Numbers in tabular figures.
- Emphasis inside a sentence uses weight or the signal colour of the same family, never a
  different typeface.
- No eyebrows. Headlines carry the section. The camera readout is live data, not a label.
- Fonts are self-hosted, variable WOFF2, `font-display: swap`, with metric-matched fallbacks
  (`size-adjust`) to keep CLS under 0.05. Panchang and Switzer are preloaded.

---

## 4. Grid, spacing and scale strategy

| Range | Columns | Gutter | Outer margin |
|---|---|---|---|
| < 768 | 4 | 16px | 20px |
| 768-1023 | 8 | 20px | 32px |
| ≥ 1024 | 12 | `clamp(20px, 1.4vw, 40px)` | `clamp(32px, 3.5vw, 96px)` |

- **Content frame:** `width: min(100% - 2 × margin, 3200px)`, centred.
- **2560px and 4K:** type keeps scaling to ~3400px (a 4K screen is viewed from further away;
  QA showed the 2560px caps looked sparse at 3840). Above 3200px the content frame is
  *pillarboxed* while the 3D canvas stays full-bleed, so the extra width shows more of the world,
  not stretched UI. This mirrors how a widescreen frame sits inside a larger screen.
- **Vertical rhythm:** section padding `clamp(6rem, 4rem + 10vw, 18rem)`. Pinned sections are
  `100svh` stages; full-height blocks use `min-height: 100svh`, never `100vh`.
- **Breakpoints (Tailwind v4 `@theme`):** `sm 40rem`, `md 48rem`, `lg 64rem`, `xl 80rem`,
  `2xl 96rem`, `3xl 120rem` (1920), `4xl 160rem` (2560).
- **Shape lock:** everything is square-cornered (`radius: 0`). Frames are rectangles, so buttons,
  tiles, inputs and overlays are rectangles too.
- **Z-index scale (one constants file):** canvas 0, content 10, HUD 20, nav 30, cursor 40,
  overlays (project/menu) 50, preloader 60.

---

## 5. Motion principles

**Every move is a camera move.** Each animation has to answer "what is the camera doing?":
widening, focusing, framing, panning or cutting. If it isn't one of those, it doesn't animate.

### Eases (registered once in `src/animations/eases.js` via CustomEase)

| Name | Curve | Use |
|---|---|---|
| `lens` (default) | `M0,0 C0.16,1 0.3,1 1,1` | Reveals and settles: long, confident deceleration |
| `shutter` | `M0,0 C0.76,0 0.24,1 1,1` | Cuts: overlays, menu, project transitions |
| `focus` | `M0,0 C0.45,0 0.15,1 1,1` | Timed blur-to-sharp (focus that "hunts" briefly, then locks) |
| `lock` | `M0,0 C0.3,1.4 0.45,1 1,1` | Autofocus brackets snapping to a target, magnetic release |
| scrub | `none` | Anything mapped to scroll (scroll *is* the easing) |

`power1` and default `power2` are not used anywhere.

### Durations

| Kind | Duration |
|---|---|
| Micro (colour, underline, icon) | 0.25-0.35s |
| Cursor and focus brackets | 0.5s |
| Line and word reveals | 0.9s |
| Display characters (wordmark only) | 1.1s |
| Cuts (shutter, frame expand) | 1.0-1.2s |
| Preloader | min 1.4s, max 3.2s |

### Stagger
- Lines: 0.08s, with the total capped at 0.5s.
- Words: 0.025s. Characters: wordmark only, 0.08s per character.
- Items such as tiles and cards: 0.1s, at most 4 items animated per group.

### Text reveals
- SplitText with `mask: "lines"` and `autoSplit: true` (so it re-splits on resize). Lines rise
  `yPercent: 105 → 0` inside the mask with `lens`. There are no plain opacity fades on headlines.
- SplitText's `aria` handling stays on, so screen readers get the unsplit sentence.

### Scroll behaviour
- **Lenis** for smooth scrolling (chosen over ScrollSmoother: it keeps native scroll position,
  so `position: sticky`, find-in-page, anchor links and keyboard scrolling all behave). Settings:
  `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false` (native momentum on touch), driven from
  `gsap.ticker` with `lagSmoothing(0)` so Lenis and ScrollTrigger share one clock.
- **Tied vs triggered.** Camera moves, the manifesto focus pull, service lens changes, the
  process pan and the end-card expansion are *scrubbed* (`scrub: 0.8`, which gives dolly
  inertia). Headings, captions and tiles are *triggered once* on enter and never replay in
  reverse.
- **Pacing.** Pinned stages alternate with free scrolling: pin (hero) → free (manifesto) → pin
  (services) → free and still (work) → pin (process) → free (open) → pin (end card). Work and
  Contact are deliberately still: nothing moves there unless the visitor does something.
- **No scroll snapping, no scroll cues.** The dolly zoom starts responding to the first wheel
  tick, so it explains itself.

### Cursor and hover (fine pointers only)
- The native cursor stays visible. We add an **autofocus box**: four 1px corner brackets in a
  14px square that trail the pointer (`lerp 0.18`).
- Over any `[data-focus]` target (links, buttons, cards), the box animates to the target's
  bounds plus 6px (`lock`, 0.5s), flashes signal yellow for 120ms ("focus confirmed"), then stays
  paper. **Keyboard focus moves the same box**, alongside the native 2px signal focus ring.
- Magnetic pull on primary buttons and the email link: up to 8px, released with `lock`.
- Touch devices and `prefers-reduced-motion` get no box and no magnetism; the system cursor and
  focus rings do the job.

### Reduced motion (`prefers-reduced-motion: reduce`)
The experience stays the same, but nothing travels.
- Lenis off (native scroll). No pins: pinned stages become normal stacked sections.
- The hero shows a single static mid-zoom frame (FOV 35°). Lens changes become 0.4s
  cross-fades. 3D renders on demand only (`frameloop="demand"`).
- Text reveals become 0.4s opacity fades. The manifesto is fully in focus. The process section is
  a vertical list. The end-card appears with a fade, not an expansion.
- Cursor box off. Project overlays fade instead of expanding.

---

## 6. The 3D system

**One shared `<Canvas>`**, fixed full-viewport behind the DOM (`aria-hidden`, `pointer-events:
none`, with events sourced from the root). Extra views (the Open section's interactive breakdown,
the Work media planes) render into DOM-tracked rectangles of the **same** canvas through drei
`<View>`, not separate canvases.

### The world: "every screen is a window"
- **Frames:** ~40 instanced planes drawn by one SDF border shader (anti-aliased with `fwidth`,
  constant line weight). Each frame takes a real screen ratio (2.39, 1.85, 16:9, 4:3, 1:1, 4:5,
  9:16) and is spaced along the z-axis from in front of the subject to deep behind it, with tiny
  rotation and offset jitter. That's one draw call.
  - *Prototype fixes:* frames in front of the subject get fewer instances, almost no rotation
    jitter and a near-plane fade, so the 8° state reads as clean nested frames rather than chaos.
    Spacing is denser near the subject, and near frames are larger, so the 78° state reads as a
    corridor around you rather than an empty void.
- **The subject frame** at z = 0 takes **the visitor's own viewport ratio** in landscape: the
  innermost window is literally your screen. In portrait it becomes a vertical frame and the
  wordmark stacks **F / O / V** (tested in the prototype; see RESEARCH.md §7).
- **The O is the lens.** The vanishing point and the far "window" are aligned to the counter of
  the wordmark's **O**, so the light at the end of the tunnel always sits inside it. The
  prototype found this by accident; we keep it on purpose.
- **Projector dust:** 1.5k-6k points drifting slowly. Their shader computes a circle of confusion
  from a `uFocusDistance` uniform, so out-of-focus dust turns into soft bokeh discs. This gives
  real-looking depth of field **without a post-processing DOF pass** and is cheap enough for
  phones.
- **The window:** a warm emissive rectangle at the far end of the tunnel, the "place" the
  tunnel leads to. Desktop adds a small mipmap bloom; mobile uses a glow sprite.
- **Pointer parallax:** the camera yaws and pitches up to 1.5° toward the pointer, damped.

### The dolly zoom (signature 3D moment)
To keep the subject frame (height `h`) the same size on screen while the FOV changes, the camera
distance follows

```
d(fov) = h / (2 · k · tan(fov / 2))       k = subject's share of viewport height
```

so the camera travels from d ≈ 13 (8°, ≈171mm) to d ≈ 1.1 (78°, ≈15mm). Frames in front of the
subject fly past the lens, and frames behind it fall away into depth. At the end of the hero, the
camera passes *through* the subject frame and the wordmark characters scale past the lens
(scrubbed) into the tunnel.

The **readout** (bottom right, mono) shows the camera's real values, computed from the camera
every frame: vertical FOV in degrees and the full-frame equivalent focal length
`f = 12 / tan(vfov / 2)` mm. It's live state, not decoration.

### Lens map (camera state per section)

| Section | Camera | FOV / lens | Focus | What changes |
|---|---|---|---|---|
| Preloader | static, d = 13 | 8° / 171mm | wordmark | Wordmark blur → sharp tracks load progress |
| Hero | dolly in, then through the subject | 8° → 78° | subject | The dolly zoom |
| Manifesto | slow forward drift | 78° → 60° | racks to ∞ | Dust becomes bokeh as the words come into focus |
| Services · 3D Websites | inside the tunnel, slow orbit | 24mm / 53.1° | near | Frames widen into a room |
| Services · Motion | travelling | 50mm / 27.0° | mid | Frames rotate in a staggered wave down the tunnel |
| Services · Video | locked off | 85mm / 16.1° | subject | Frames flatten and the vintage camera model looks back at you |
| Work | idle, scene dims to 25% | 40° | soft | WebGL media planes take over |
| Process | lateral truck matching the DOM pan | 35° | centre | 3D and DOM pan together |
| Open | drift; breakdown `<View>` live | n/a | n/a | Interactive dolly-zoom demo |
| End card | pull back to 8° (bookend) | 78° → 8° | subject | Frames re-flatten, then the innermost frame floods signal yellow |

### Quality tiers

| | High (desktop dGPU) | Mid (laptops) | Low (touch / weak GPU) |
|---|---|---|---|
| DPR | `[1, 2]`, total pixels capped at ~8.3M | `[1, 1.5]` | `[1, 1.5]` |
| Dust points | 6,000 | 3,500 | 1,500 |
| Post-processing | mipmap bloom, shader grain | bloom | none |
| Work media | WebGL planes (velocity lens distortion) | WebGL planes | DOM images |
| Camera model | yes | yes | yes (Meshopt, 1k WebP textures) |

The tier is picked from pointer type, `hardwareConcurrency` and `deviceMemory`, then adjusted at
runtime with drei `<PerformanceMonitor>` (which drops DPR, then bloom). The 4K pixel cap keeps
the canvas from rendering ~33M pixels on a 4K display at DPR 2. Type is DOM, so it stays sharp at
any DPR.

**Render budget:** `frameloop` switches to `"never"` while the end card fully covers the viewport
or the tab is hidden. `<View>`s render only while their section intersects the viewport.

### Fallbacks
- **No WebGL:** a CSS-only version of the flat telephoto state (nested square-cornered frames
  scaled around the centre) with DOM images in Work. The layout and content are identical.
- **Asset failure or slow network:** the preloader caps at 3.2s and lets the visitor in. The
  scene fades in whenever it's ready.

### Assets
- **Procedural (built in code):** frames, dust, the window, grain. No download needed.
- **Downloaded (to verify at the 3D phase):** Poly Haven *Vintage Video Camera* (CC0) for the
  Video lens state. Lighting comes from drei `<Lightformer>`s (procedural) rather than an HDRI,
  to save ~1.5 MB. If reflections need it, a 1k Poly Haven studio HDRI (CC0) is the fallback.
- **Pipeline:** `gltf-transform optimize --compress meshopt --texture-compress webp
  --texture-size 1024`. Lazy-loaded after first paint. Every asset is logged in `CREDITS.md` and
  listed in the on-site Credits dialog.

---

## 7. Section plan

The order follows the brief with two merges (see §8). Each section uses a different layout
family, so seven sections use seven families.

### 0 · Preloader: "Focusing"
- **Layout:** the hero wordmark is visible from the first paint (it is the LCP element), heavily
  blurred, inside four corner brackets at the viewport edges. Bottom left, in mono: `FOCUSING 64%`.
- **Signature moment:** load progress *is* the focus pull. The wordmark's blur tracks real asset
  progress. At 100% the brackets snap in to frame the wordmark (`lock`), flash yellow (focus
  confirmed), then expand back out to the viewport edges and dissolve as the 3D scene fades up.
  This doubles as the transition into the hero.
- **Mobile:** same. **Reduced motion:** a 0.4s fade.

### 1 · Hero: "Widen"
```
┌──────────────────────────────────────────────────────────────┐
│ FOV                          Work  Services  Process  Open  [Start a project] │
│                                                              │
│        ┌──────────────────────────────────────────────┐      │
│        │ ┌──────────────────────────────────────────┐ │      │
│        │ │                                          │ │      │
│        │ │             F  O  V                       │ │      │
│        │ │                                          │ │      │
│        │ └──────────────────────────────────────────┘ │      │
│        └──────────────────────────────────────────────┘      │
│ The internet should feel like a place          FOV 8.0°  171mm │
│ again, not a feed. We're building the                          │
│ places and films worth stopping for.                           │
└──────────────────────────────────────────────────────────────┘
```
- **Content:** the wordmark (h1, with a visually hidden "FOV, a studio for 3D websites, motion
  and video"), the **vision verbatim** at bottom left (20 words), the live readout at bottom
  right, and the nav CTA.
- **Signature moment:** the dolly zoom (§6). Pinned for +150svh on desktop and +100svh on mobile.
- **Why centred:** the dolly zoom is radially symmetric around the vanishing point, so here the
  composition *is* the message. The asymmetry lives in the corners.
- **Mobile (portrait):** the wordmark stacks F / O / V inside a vertical subject frame (a poster
  composition, not a shrunken desktop), with the vision line above the readout. Prototype frames
  are in `docs/assets/proto-dolly-mobile-*.jpg`.
- **Prototype:** `docs/assets/proto-dolly.html` plus renders at 8°, 30° and 78°
  (`docs/assets/proto-dolly-desktop-*.jpg`).

### 2 · Manifesto: "Focus"
- **Content:** the **mission, verbatim**, set large (`--fs-manifesto`, Switzer 500), left-aligned
  across columns 2-11.
- **Signature moment (signature scroll moment):** a scroll-scrubbed *rack focus*. Each word
  starts soft (blur 8px, opacity 0.2) and comes into focus in reading order as you scroll.
  "Impossible to ignore" locks in signal yellow. At the same time the 3D world racks *out* of
  focus (`uFocusDistance` → ∞, so the dust turns to bokeh). Focus moves from the world to the
  words: 3D and DOM share one focus pull.
- **Mobile:** words fade in (opacity + 8px rise) instead of blurring, because per-word `filter`
  is too expensive on mid-range Android. The 3D bokeh pull stays.

### 3 · Services: "Choose a lens"
```
┌──────────────────────────────────────────────────────────────┐
│ What we make                                                 │
│                                                              │
│ 3D Websites            (active, paper)                       │
│ Motion                 (dim, 18%)                            │
│ Video                  (dim, 18%)          24mm   53.1°       │
│                                            Real-time 3D you  │
│                                            can walk into…    │
│                                            WebGL · Configur… │
└──────────────────────────────────────────────────────────────┘
```
- **Content:** three service names in Panchang (`--fs-display`), stacked. The active service's
  description (≤ 25 words), capabilities and its lens sit bottom right.
- **Signature moment:** each service is a lens. Scrolling through the pinned stage (+200svh)
  changes the 3D camera's focal length (24 → 50 → 85mm) and reconfigures the world (§6 lens map).
  The readout and the active name change together. Video gets one line; it's a mention, not a
  deep dive.
- **Mobile:** no pin. Three stacked blocks, each changing the lens as it crosses the centre of
  the viewport.

### 4 · Selected work: "Frame"
- **Layout:** an asymmetric, staggered gallery with four different ratios, one per project:
  16:9 (cols 1-8), 4:5 (cols 9-12, offset down), 1:1 (cols 3-7), 2.39:1 (cols 6-12). Captions sit
  *below* the media, never on it: title (Switzer 500), one line, then discipline and year (mono,
  smoke).
- **Signature moments:**
  - *Lens distortion:* the media are WebGL planes synced to their DOM boxes. Scroll velocity bends
    them with a barrel distortion (capped), which settles as you stop.
  - *Focus lock on hover:* the hovered piece racks sharp, the others soften, and the autofocus box
    snaps to it.
  - *Frame-expand cut:* clicking expands the media to full screen (FLIP, `shutter`, 1.1s) into a
    project overlay (title, client, year, disciplines, summary, "Next project"). Esc or Close
    reverses the move. The URL hash updates, so the overlay is linkable and the back button works.
- **Still moment:** nothing here moves on its own.
- **Mobile:** a single column of DOM images with a `clip-path` frame reveal on enter. Tap opens
  the overlay with a shutter cut.

### 5 · Process: "Pan"
- **Content:** four verbs: **Look, Frame, Make, Ship**, each with ≤ 30 words. There are no
  "Step 1" labels; the verb is the label.
- **Signature moment:** a pinned horizontal *camera pan*. Vertical scroll pans the track
  sideways. The panel crossing the centre of the frame racks into focus and the others sit soft
  and dim. The 3D camera trucks sideways at a matched rate, so the world and the type pan as one
  shot.
- **Mobile:** a vertical stack. Each panel racks into focus as it reaches the centre of the
  viewport. No horizontal hijack.

### 6 · Open: "Wide open"
- **Layout:** a four-cell bento with real visual variety:

| Cell | Span (desktop) | Content |
|---|---|---|
| A | cols 1-7, two rows | **Live breakdown of our own dolly zoom.** A drei `<View>` mini-scene with an accessible FOV slider (`<input type="range">`), the formula in mono, and "Read the breakdown". |
| B | cols 8-12 | Experiment: hover to rack-focus a word, showing the bokeh shader in isolation |
| C | cols 8-10 | Open code: our camera helpers on GitHub (signal-yellow tile) |
| D | cols 11-12 | Notes: how we budget 3D for mid-range Android phones |

- **Signature moment:** the site explains its own signature trick, and the visitor drives it.
  That is "we don't keep the good stuff to ourselves" made literal.
- **Mobile:** A full width, then B-D in a horizontal scroll-snap rail.

### 7 · End card (Contact + Footer): "Lights on"
- **Signature moment:** after Open, the camera pulls back to 8°. The tunnel flattens back into
  nested frames, bookending the hero. The innermost frame then **floods signal yellow** and
  expands to full bleed (`clip-path: inset()` scrubbed from the frame's rectangle to 0). This is
  the page's one colour flip: the screening room lights come on.
- **Content (on signal, in ink):**
  - Headline (Panchang): *Got something worth stopping for?*
  - Body: one line on what to send.
  - **CTA:** the email address as a giant magnetic link, plus a "Copy email" button with
    "Copied" feedback.
  - Socials: Instagram, LinkedIn, Vimeo, GitHub.
- **Footer row:** `MUMBAI 21:47 IST` (live, ticking each minute), then the offset to the
  visitor: "4h 30m ahead of you", "Same time as you" or "2h behind you". Also © 2026 FOV,
  Credits (a dialog listing fonts and 3D assets with licences) and Back to top.
- **Mobile:** same order, stacked. The expansion runs over +80svh.

### Global
- **Nav (fixed, 64px):** FOV (small Panchang) on the left; Work, Services, Process, Open and the
  "Start a project" button on the right. "Start a project" is the **only** contact label on the
  page; it scrolls to the end card. Over the end card, nav colours swap to ink.
- **Mobile nav:** a "Menu" button opens a full-screen menu with a shutter cut, large Panchang
  links and the Mumbai time.
- **Camera readout:** fixed bottom right. It shows from the hero through Services, fades during
  Work, and is hidden on mobile after the hero.
- **Skip link,** landmarks (`header`, `main`, `section` with headings, `footer`), and every
  interactive element reachable and visible on keyboard focus.

---

## 8. Structure changes from the brief, and why

1. **The vision moved into the hero and the mission is the manifesto.** The brief asks for a
   vision line in the hero *and* both statements in the manifesto. Showing the vision twice
   weakens it. The hero carries the *why* (vision, verbatim), and the manifesto gets a full stage
   for the *how* (mission, verbatim). Both appear exactly once, word for word.
2. **Contact and Footer are merged into one end card.** The colour flip and the Mumbai clock land
   as one closing moment instead of two thin sections. It is also the bookend to the hero's
   dolly zoom.
3. **The order is otherwise unchanged:** the camera story runs widen → focus → lens → frame →
   pan → open → lights on.

---

## 9. Copy deck (draft)

Voice: plain, confident, short. British English (colour, optimise). No em-dashes. Items marked
*(placeholder)* get `{/* PLACEHOLDER */}` in code.

| Where | Copy |
|---|---|
| Preloader | `FOCUSING 64%` (screen reader: "Loading FOV") |
| Hero | **FOV** / vision, verbatim |
| Manifesto | Mission, verbatim |
| Services heading | What we make |
| 3D Websites | Real-time 3D you can walk into. Built for the browser, fast on a phone. *(placeholder)* |
| Motion | Interfaces that move with intent. Scroll stories, transitions and type that make people slow down. *(placeholder)* |
| Video | Films from shoot to edit to final delivery. One crew, start to finish. *(placeholder)* |
| Work heading | Selected work |
| Projects *(placeholder)* | **Halden Audio**: launch site for a pair of open-back headphones (3D Website, 2026) · **Kinari**: brand film for a handloom textile label (Video, 2026) · **Northline**: configurator for a folding e-bike (3D + Motion, 2025) · **Pause Radio**: motion system for a late-night radio station (Motion, 2025) |
| Process heading | How we work |
| Look | We start by watching. Your brand, your audience, and everything already fighting for their attention. Then we find the angle nobody took. *(placeholder)* |
| Frame | We decide what's in shot and what isn't. Concept, script, design and a clickable prototype, before anything gets expensive. *(placeholder)* |
| Make | 3D, motion and film, built by the people you met on day one. You see progress every week, not at the end. *(placeholder)* |
| Ship | We test on real phones, tune until it's fast, and launch. Then we stick around, because launch day is when the real feedback starts. *(placeholder)* |
| Open heading | Wide open |
| Open intro | Every trick on this site, explained. Plus the experiments that didn't make it in, and the code behind them. |
| Open tiles *(placeholder)* | The dolly zoom, explained / Rack focus with one uniform / fov-camera: our camera helpers, MIT licensed / Shipping 3D to a ₹10,000 phone |
| End-card headline | Got something worth stopping for? |
| End-card body | Tell us what you're making and when it needs to ship. We reply within two working days. *(placeholder: confirm the promise)* |
| CTA | `hello@fov.studio` *(placeholder)* + Copy email → Copied |
| Copy failure | Couldn't copy. The address is hello@fov.studio. |
| Nav CTA | Start a project |

Alternatives for the end-card headline:

| Option | Copy | Tone | Best for |
|---|---|---|---|
| A (recommended) | Got something worth stopping for? | Inviting, echoes the vision | Default |
| B | Let's make something worth stopping for. | Warmer, collaborative | If A feels too cheeky |
| C | Bring us the brief. | Blunt, confident | If the page needs a harder close |

---

## 10. Performance and accessibility commitments

- **LCP** is the DOM wordmark, painted on first render with a preloaded font. three.js, R3F and
  the scene load in a separate chunk after first paint (`import()` on idle), so Lighthouse mobile
  ≥ 85 stays realistic.
- **CLS < 0.05:** metric-matched font fallbacks and reserved aspect-ratio boxes for all media.
- **INP:** all scroll work goes through ScrollTrigger and Lenis on one ticker. No scroll
  listeners write to React state.
- **Core content stays in the DOM:** every word, project and link is HTML. WebGL only draws
  pixels.
- **Keyboard:** skip link, logical tab order, Esc closes overlays, focus is trapped in dialogs and
  returned on close, and the FOV slider is a native range input.
- **Contrast:** see §2. Every pair passes AA, most pass AAA.
- Every GSAP context and ScrollTrigger is created through `useGSAP` with a scope, so cleanup on
  unmount is automatic.

---

## 11. Deliberate overrides of skill defaults

The installed design skills set useful defaults. The brief and this concept override a few of
them on purpose:

| Skill default | Our call | Reason |
|---|---|---|
| Use Motion (`motion/react`) for UI animation | GSAP + `@gsap/react` only | Required by the brief; one animation engine avoids frame conflicts with R3F |
| No custom cursors | Autofocus *brackets* added, native cursor kept | The brief asks for cursor interaction. Keeping the system cursor preserves accessibility |
| Dark and light mode by default | Dark only, plus one colour-block flip | A screening-room concept. Revisit in iteration 2 if wanted |
| No locale or time strips | Live Mumbai time in the footer | Requested by the brief; real, useful information for a studio with clients in other time zones |
| Avoid centred heroes | Centred hero | The dolly zoom is symmetric around the vanishing point |
| Image generation first for imagery | Generated placeholder stills | Founders approved generating them |

---

## 12. Founder decisions (2026-10-10)

1. **Concept:** go ahead with the camera concept, but **never use an expanded name**. The
   concept is called "The Lens" internally, and the brand is only "FOV".
2. **Imagery:** generate the placeholder stills for the work pieces and Open tiles. Each is
   logged in CREDITS.md as AI-generated placeholder imagery.
3. **Contact details:** the studio is still setting up, so the email, domain and social handles
   are temporary and marked `PLACEHOLDER` in code.
4. **Repo:** private. The Fontshare WOFF2 files are committed under `public/fonts/`.

---

## 13. Implementation notes (iteration 1 build)

What changed between this plan and the shipped build, and why:

- **The page is prerendered.** `npm run build` server-renders the app into `dist/index.html`
  (`src/entry-server.jsx`, `scripts/prerender.mjs`) and the client hydrates it. The wordmark and
  all copy paint before any JavaScript runs. This moved mobile LCP from 6.4s to 2.5s.
- **3D tiers.** High and mid tiers load the scene during the preloader. The low tier (phones)
  loads it on first interaction or after 6s idle, so three.js never competes with first paint.
  The CSS frame fallback holds until the 3D frames take over.
- **One canvas, custom render pipeline** (`src/three/RenderPipeline.jsx`): the world goes
  through post-processing on capable desktops (bloom, velocity chromatic aberration, grain,
  vignette). The Work media planes and the Open demo are then drawn into their DOM rectangles of
  the same canvas. drei `<View>` was not used because it conflicts with a composer.
- **Work media are WebGL planes on desktop**, with velocity bend and barrel distortion, a hover
  ripple and RGB split, others racking out of focus, and a frame-opening reveal that mirrors the
  DOM clip. Until real imagery exists the plane art is a procedural zooming frame tunnel. Phones
  get the DOM version.
- **Frames are instanced line bands**, not full quads, so 4K overdraw stays tiny. Depth of field
  is a per-frame circle of confusion, deep at 8° and shallower as the lens widens.
- **three.js is pinned to 0.182.0**, the last release before `THREE.Clock` was deprecated. R3F
  9.8 still creates a Clock, so newer three logs a console warning.
- **Type scales to about 3400px** and the content frame caps at 3200px (see §4).
- **Accessibility fixes from QA:** inactive service names are at 40% opacity (about 3.3:1). Soft
  "rack focus" states are only applied while their section is on screen. SplitText's ARIA is off
  for paragraphs. Tap targets are at least 24px. axe-core reports 0 violations at 1440, 390 and
  200% zoom.

QA tooling (Playwright): `npm run qa:screens` (seven breakpoints), `qa:journey` (scroll journey;
`--mobile`, `--reduced`), `qa:interact` (keyboard, overlays, slider, menu) and `qa:a11y` (axe).
The dev server for these scripts runs on port 5419 (`npx vite --port 5419`).
