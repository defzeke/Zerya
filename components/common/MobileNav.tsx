'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

interface MobileNavProps {
  items: readonly { href: string; label: string }[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function close() {
    setOpen(false)
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="min-h-11 min-w-11 flex items-center justify-center"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu size={24} />
      </button>
      {open &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30"
              onClick={close}
              aria-hidden="true"
            />
            <nav className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-cream shadow-xl p-6 flex flex-col">
              <button
                onClick={close}
                className="self-end min-h-11 min-w-11 flex items-center justify-center mb-8"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="text-lg uppercase tracking-wider text-charcoal hover:text-heading py-3 min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </>,
          document.body,
        )}
    </div>
  )
}
