// All site copy in one place, written from docs/BRAND.md. Anything marked
// PLACEHOLDER needs a real value before launch.

export const STUDIO = {
  name: 'Bombay Craft',
  tagline: 'Born in Bombay. Crafted for the world.',
  guidingIdea: ['Build useful things.', 'Craft them with care.', 'Grow with purpose.'],
  // PLACEHOLDER: the studio's real inbox and WhatsApp number (digits only, with country code).
  email: 'hello@bombaycraft.com',
  whatsapp: '',
  city: 'Mumbai, India',
}

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
]

// PLACEHOLDER: confirm the tools the team actually uses.
export const TOOLS = ['Figma', 'React', 'Next.js', 'Node.js', 'Webflow', 'Shopify', 'WordPress', 'HubSpot', 'Zoho', 'PostgreSQL', 'Premiere Pro', 'After Effects']

// PLACEHOLDER: concept pieces until real case studies exist. Each is labelled
// "Concept" on the site. `demo` picks the scene used as the cover.
export const WORK = [
  { title: 'Monsoon FM', kind: 'Website · CMS · Live player', demo: 'web' },
  { title: 'Deco Residences', kind: 'Enquiry CRM · Sales dashboard', demo: 'crm' },
  { title: 'The Local Line', kind: 'Web app · UI/UX · Design system', demo: 'app' },
  { title: 'Chai & Co.', kind: 'E-commerce website · Product photography · Social', demo: 'reel' },
]

// Core services lead; supporting services extend them (docs/BRAND.md §4).
// `id` is the anchor used by the hero toolkit.
export const SERVICES = [
  {
    id: 'websites',
    title: 'Website design & development',
    body: 'Fast, accessible websites designed around what your business needs them to do, from a first site to a full redesign.',
    tags: ['Business & corporate sites', 'Service-business sites', 'Portfolios', 'Landing pages', 'E-commerce', 'Redesigns & maintenance'],
  },
  {
    id: 'product',
    title: 'UI/UX & product design',
    body: 'Research, flows and interfaces that make digital products easy to understand and pleasant to use.',
    tags: ['User research & IA', 'Flows & wireframes', 'Interactive prototypes', 'Design systems', 'SaaS interfaces'],
  },
  {
    id: 'apps',
    title: 'Custom web applications',
    body: 'Tools built for the way you actually work: portals, dashboards and workflow systems that replace spreadsheets and email chains.',
    tags: ['Internal tools', 'Customer & partner portals', 'Admin panels', 'Booking & enquiry systems', 'API integrations'],
  },
  {
    id: 'crm',
    title: 'CRM & business automation',
    body: 'Every lead and customer in one place, with the repetitive work automated, so your team spends time on people, not paperwork.',
    tags: ['Custom CRM & implementation', 'Lead management', 'Sales & ops dashboards', 'Approval flows', 'Third-party integrations'],
  },
]

export const SUPPORTING = [
  {
    id: 'branding',
    title: 'Branding & digital identity',
    body: 'Positioning, naming support, logos and identity systems that give your digital presence a clear voice.',
  },
  {
    id: 'marketing',
    title: 'Digital marketing',
    body: 'Campaign planning, social creative, search visibility and landing pages that bring the right people to your site.',
  },
  {
    id: 'production',
    title: 'Video, photography & production',
    body: 'Brand and product photography, campaign videos and short-form content, shot and edited in-house.',
  },
]

export const AUDIENCES = [
  { title: 'Small businesses & local brands', body: 'A professional digital presence that is easy to run.' },
  { title: 'Startups & founders', body: 'Turning an idea into a product or service people can use.' },
  { title: 'Growing companies', body: 'Better systems, automation and custom applications.' },
  { title: 'Established businesses', body: 'Reliable digital experiences, integrations and operational tools.' },
  { title: 'Community organisations & NGOs', body: 'Accessible digital support, as our impact work develops.' },
]

export const DIFFERENCE = [
  { title: 'Digital-first thinking', body: 'Websites and technology are central to what we do, not an afterthought.' },
  { title: 'Connected capabilities', body: 'Design, development, business systems and creative production work together.' },
  { title: 'Business-aware solutions', body: 'We look at the operational goal behind the brief, not just the visual output.' },
  { title: 'Flexible collaboration', body: 'A focused project or a broader digital roadmap, at the pace that suits you.' },
]

export const VALUES = [
  { title: 'Craft over shortcuts', body: 'We care about the details and whether the solution genuinely works.' },
  { title: 'Technology with purpose', body: 'Technology to solve problems, not to look advanced.' },
  { title: 'People before ego', body: 'We listen, explain our decisions and treat everyone with respect.' },
  { title: 'Accessible ambition', body: 'High-quality digital work within reach at every stage of growth.' },
  { title: 'One team, shared ownership', body: 'One team takes responsibility from idea to delivery.' },
  { title: 'Honest partnerships', body: 'Clear about scope, cost, timelines, trade-offs and outcomes.' },
  { title: 'Growth that gives back', body: 'Success that creates benefits beyond the company.' },
]

export const PROCESS = [
  { title: 'Discover', body: 'Understand the business, audience, goals, constraints and the problems to solve.' },
  { title: 'Define', body: 'Agree scope, priorities, deliverables, timeline and how we will measure success.' },
  { title: 'Design', body: 'Plan the experience, structure, interface and visual direction.' },
  { title: 'Build', body: 'Develop, integrate and test the solution.' },
  { title: 'Launch', body: 'Prepare the site or system for real-world use.' },
  { title: 'Improve', body: 'Agreed support, measurement where possible, and the next improvements.' },
]

// Intentions, not claims (docs/BRAND.md §7): never state partnerships,
// donations or impact figures that have not happened.
export const IMPACT = [
  'Selected website and digital services for NGOs, at reduced cost or pro bono',
  'Practical technology and digital-literacy support for community organisations',
  'A defined share of profits donated, once the business is sustainable',
  'Partnerships with credible organisations working on causes we share',
]

export const NEEDS = ['Website', 'UI/UX', 'Web app', 'CRM & automation', 'Branding', 'Marketing', 'Video & photo']
