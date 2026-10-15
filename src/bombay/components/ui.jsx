import { ArrowUpRight } from '@phosphor-icons/react'
import logoUrl from '../../assets/logo/bombay-crafts-mark.webp'
import { jump } from '../lib/jump'

export function Logo({ className = '', label = 'Bombay Craft', style }) {
  return (
    <span
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={`logo-mask ${className}`}
      style={{ '--logo-url': `url(${logoUrl})`, ...style }}
    />
  )
}

/** Pill button with a status dot. `solid` is ink on paper; `ghost` is a hairline outline. */
export function Button({ href, children, variant = 'solid', size = 'md', className = '', arrow = false, ...rest }) {
  const variants = {
    solid: 'bg-ink text-paper hover:bg-maroon',
    ghost: 'border border-line text-ink hover:border-ink',
  }
  const sizes = { sm: 'px-4 py-2 text-small', md: 'px-6 py-3.5 text-[0.9375rem]' }
  const internal = href?.startsWith('#')
  return (
    <a
      href={href}
      onClick={internal ? (e) => jump(e, href.slice(1)) : undefined}
      className={`group inline-flex items-center gap-2 rounded-full font-medium transition-colors duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      <span className="size-1.5 rounded-full bg-current transition-transform duration-300 group-hover:scale-150" aria-hidden="true" />
      {children}
      {arrow && <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </a>
  )
}
