'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { MobileNav } from './MobileNav'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/inquiry', label: 'Custom Inquiry' },
  { href: '/story', label: 'Our Story' },
] as const

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-border-light">
      <div className="mx-auto max-w-[1280px] px-4 md:px-16 flex items-center justify-between h-24">
        <Link href="/" className="font-serif text-[40px] tracking-[-1px] text-heading leading-[48px]">
          Zerya Blooms
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm uppercase tracking-[1.4px] font-medium text-charcoal pb-[5px] ${
                pathname === item.href ? 'border-b border-black' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center">
          <Link href="/shop"><ShoppingBag size={20} className="text-charcoal" /></Link>
        </div>
        <MobileNav items={NAV_ITEMS} />
      </div>
    </header>
  )
}
