import { useEffect, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { jump } from '../bombay/lib/jump'
import { Logo } from '../bombay/components/ui'

/** Minimal bar: the mark and one action. Its ink follows the section beneath it. */
export default function Nav() {
  const [theme, setTheme] = useState('dark')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      // The section under the middle of the bar decides light or dark.
      const probe = 36
      const under = [...document.querySelectorAll('[data-nav]')].find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= probe && r.bottom > probe
      })
      setTheme(under?.dataset.nav ?? 'dark')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const light = theme === 'light'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
        light ? 'text-charcoal' : 'text-ivory'
      } ${scrolled ? (light ? 'bg-ivory/80 backdrop-blur-xl' : 'bg-charcoal/40 backdrop-blur-xl') : ''}`}
    >
      <nav aria-label="Main" className="frame flex h-(--nav-h) items-center justify-between">
        <a href="#top" onClick={(e) => jump(e, 'top')} aria-label="Bombay Craft, back to top">
          <Logo className="h-8 md:h-9" label="" />
        </a>
        <p className="label hidden opacity-70 md:block">Digital-first creative & technology studio</p>
        <a
          href="#contact"
          onClick={(e) => jump(e, 'contact')}
          className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-small font-medium ring-1 transition-colors duration-300 ${
            light ? 'ring-charcoal/25 hover:bg-charcoal hover:text-ivory' : 'ring-ivory/30 hover:bg-ivory hover:text-charcoal'
          }`}
        >
          Start a project
          <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </nav>
    </header>
  )
}
