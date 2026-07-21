'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export function ComingSoonModal() {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <div className="relative bg-cream p-8 md:p-12 max-w-md w-full mx-4 shadow-xl">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="font-serif text-3xl text-heading mb-4">Coming Soon</h2>
        <p className="text-charcoal mb-8 leading-relaxed">
          The custom inquiry feature is not yet available. While we perfect the
          experience, feel free to browse our ready-made collections.
        </p>
        <Link
          href="/shop"
          onClick={() => setOpen(false)}
          className="inline-flex items-center justify-center px-[33px] py-[17px] bg-black text-white text-sm font-medium tracking-[1.4px] uppercase rounded-none hover:opacity-90 transition-opacity"
        >
          Browse Collections
        </Link>
      </div>
    </div>
  )
}
