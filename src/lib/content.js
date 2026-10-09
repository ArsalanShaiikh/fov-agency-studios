// All site copy in one place. Voice: plain, confident, short (DESIGN.md §9).
// Anything marked PLACEHOLDER is temporary and gets replaced before launch.
// Brand rule: the name is only ever "FOV". Never expand the letters.

/** Verbatim. Do not edit. */
export const VISION =
  'The internet should feel like a place again, not a feed. We’re building the places and films worth stopping for.'

/** Verbatim. Do not edit. */
export const MISSION =
  'Our job is to make brands impossible to ignore online. We do it with 3D, motion, video, and an unhealthy obsession with detail, and we don’t keep the good stuff to ourselves.'

/** The phrase in the mission that locks in signal yellow. */
export const MISSION_EMPHASIS = 'impossible to ignore'

/* PLACEHOLDER: temporary contact details until the studio's accounts exist. */
export const CONTACT = {
  email: 'hello@fov.studio',
  subject: 'New project',
}

/* PLACEHOLDER: temporary social links. */
export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Vimeo', href: 'https://vimeo.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
]

export const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Open', href: '#open' },
]

export const CTA_LABEL = 'Start a project'

export const SERVICES = [
  {
    id: 'websites',
    name: '3D Websites',
    lens: 24,
    /* PLACEHOLDER */
    body: 'Real-time 3D you can walk into. Built for the browser, fast on a phone.',
    /* PLACEHOLDER */
    caps: ['WebGL and three.js', 'Product configurators', 'Interactive stories', 'Launch sites'],
  },
  {
    id: 'motion',
    name: 'Motion',
    lens: 50,
    /* PLACEHOLDER */
    body: 'Interfaces that move with intent. Scroll stories, transitions and type that make people slow down.',
    /* PLACEHOLDER */
    caps: ['GSAP interaction design', 'Scroll storytelling', 'Motion systems', 'Kinetic type'],
  },
  {
    id: 'video',
    name: 'Video',
    lens: 85,
    /* PLACEHOLDER */
    body: 'Films from shoot to edit to final delivery. One crew, start to finish.',
    /* PLACEHOLDER */
    caps: ['Direction and shoot', 'Edit and colour', 'Delivery for every screen'],
  },
]

/* PLACEHOLDER: all four projects are invented stand-ins until real case studies exist.
   `image` is null until real or generated imagery is supplied; the media slot then
   renders the frame-motif placeholder. Drop files in src/assets/work/ and import them. */
export const PROJECTS = [
  {
    id: 'halden-audio',
    title: 'Halden Audio',
    line: 'Launch site for a pair of open-back headphones.',
    discipline: '3D Website',
    year: 2026,
    ratio: [16, 9],
    roles: ['Concept', 'Design', 'WebGL development', 'Launch'],
    summary:
      'A product you can turn over in your hands before it ships. Real-time 3D, studio lighting in the browser, and a page that loads fast on a phone.',
    image: null,
  },
  {
    id: 'kinari',
    title: 'Kinari',
    line: 'Brand film for a handloom textile label.',
    discipline: 'Video',
    year: 2026,
    ratio: [4, 5],
    roles: ['Direction', 'Shoot', 'Edit', 'Colour'],
    summary:
      'Two days in a weaving town, one film about patience. Cut for cinema, vertical social and the product pages.',
    image: null,
  },
  {
    id: 'northline',
    title: 'Northline',
    line: 'Configurator for a folding e-bike.',
    discipline: '3D + Motion',
    year: 2025,
    ratio: [1, 1],
    roles: ['Configurator', '3D', 'Motion system'],
    summary:
      'Pick a colour, fold it, ride it. A configurator that answers questions before the sales team has to.',
    image: null,
  },
  {
    id: 'pause-radio',
    title: 'Pause Radio',
    line: 'Motion system for a late-night radio station.',
    discipline: 'Motion',
    year: 2025,
    ratio: [2.39, 1],
    roles: ['Identity motion', 'Broadcast package', 'Social kit'],
    summary:
      'An identity that moves at the speed of 2am. Idents, lower thirds and a kit the station team can run themselves.',
    image: null,
  },
]

export const PROCESS = [
  {
    verb: 'Look',
    /* PLACEHOLDER */
    body: 'We start by watching. Your brand, your audience, and everything already fighting for their attention. Then we find the angle nobody took.',
  },
  {
    verb: 'Frame',
    /* PLACEHOLDER */
    body: 'We decide what’s in shot and what isn’t. Concept, script, design and a clickable prototype, before anything gets expensive.',
  },
  {
    verb: 'Make',
    /* PLACEHOLDER */
    body: '3D, motion and film, built by the people you met on day one. You see progress every week, not at the end.',
  },
  {
    verb: 'Ship',
    /* PLACEHOLDER */
    body: 'We test on real phones, tune until it’s fast, and launch. Then we stick around, because launch day is when the real feedback starts.',
  },
]

export const OPEN = {
  title: 'Wide open',
  intro:
    'Every trick on this site, explained. Plus the experiments that didn’t make it in, and the code behind them.',
  tiles: [
    {
      id: 'dolly',
      kind: 'Breakdown',
      title: 'The dolly zoom, explained',
      body: 'Drag to change the lens angle. The subject stays put while the world stretches.',
      cta: 'Read the breakdown',
      href: '#open', // PLACEHOLDER: article not written yet
    },
    {
      id: 'focus',
      kind: 'Experiment',
      title: 'Rack focus with one uniform',
      body: 'How the dust in our hero turns to bokeh without a post-processing pass.',
      cta: 'See the experiment',
      href: '#open', // PLACEHOLDER
    },
    {
      id: 'code',
      kind: 'Open code',
      title: 'fov-camera',
      body: 'Our GSAP and React Three Fiber camera helpers. MIT licensed.',
      cta: 'View on GitHub',
      href: 'https://github.com/', // PLACEHOLDER: repo not public yet
    },
    {
      id: 'notes',
      kind: 'Notes',
      title: 'Shipping 3D to a ₹10,000 phone',
      body: 'How we budget polygons, textures and frames for mid-range Android.',
      cta: 'Read the notes',
      href: '#open', // PLACEHOLDER
    },
  ],
}

export const END_CARD = {
  headline: 'Got something worth stopping for?',
  /* PLACEHOLDER: confirm the reply-time promise before launch */
  body: 'Tell us what you’re making and when it needs to ship. We reply within two working days.',
  copy: 'Copy email',
  copied: 'Copied',
  copyFailed: `Couldn’t copy. The address is ${CONTACT.email}.`,
}

export const CREDITS = {
  fonts: [
    { name: 'Panchang', by: 'Indian Type Foundry', license: 'ITF Free Font License', href: 'https://www.fontshare.com/fonts/panchang' },
    { name: 'Switzer', by: 'Indian Type Foundry', license: 'ITF Free Font License', href: 'https://www.fontshare.com/fonts/switzer' },
    { name: 'Geist Mono', by: 'Vercel', license: 'SIL Open Font License 1.1', href: 'https://github.com/vercel/geist-font' },
  ],
  models: [
    {
      name: 'Vintage Video Camera',
      by: 'Jenelle van Heerden and James Ray Cock, Poly Haven',
      license: 'CC0',
      href: 'https://polyhaven.com/a/vintage_video_camera',
    },
  ],
}
