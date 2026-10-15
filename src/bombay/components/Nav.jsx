import { useEffect, useState } from 'react'
import { NAV } from '../lib/content'
import { jump } from '../lib/jump'
import { Logo } from './ui'

export default function Nav() {
  const [past, setPast] = useState(false)

  useEffect(() => {
    // Cream over the dark mosaic; a paper bar with ink type once past it.
    const onScroll = () => {
      const hero = document.getElementById('top')
      setPast(window.scrollY > (hero?.offsetHeight ?? window.innerHeight) - 64)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,backdrop-filter,box-shadow] duration-500 ${
        past ? 'bg-paper/85 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : 'text-cream'
      }`}
    >
      <nav aria-label="Main" className="flex h-(--nav-h) items-center justify-between px-4 md:px-6">
        <a href="#top" onClick={(e) => jump(e, 'top')} aria-label="Bombay Craft, back to top">
          <Logo className="h-8 md:h-9" label="" />
        </a>

        <ul className="flex items-center gap-1">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={(e) => jump(e, n.id)} className="group block px-3 py-2 text-[0.9375rem] font-medium">
                {/* Text rolls up on hover */}
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-500 ease-(--ease-lens) group-hover:-translate-y-full">{n.label}</span>
                  <span aria-hidden="true" className="absolute inset-x-0 top-full block transition-transform duration-500 ease-(--ease-lens) group-hover:-translate-y-full">
                    {n.label}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
