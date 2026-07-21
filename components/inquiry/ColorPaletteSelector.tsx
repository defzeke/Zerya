'use client'

import { useState } from 'react'

const PALETTES: {
  name: string
  bg: string
  text: string
  border?: string
}[] = [
  { name: 'Neutral', bg: 'bg-[#e4e2dd]', text: 'text-heading' },
  { name: 'Warm Autumn', bg: 'bg-[#f4ece4]', text: 'text-[#5e4b3e]' },
  { name: 'Cool Verdant', bg: 'bg-[#e6ecea]', text: 'text-[#3e564e]' },
  { name: 'Custom', bg: 'bg-cream', text: 'text-heading', border: 'border border-border' },
]

export function ColorPaletteSelector() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div>
      <label className="block text-xs font-medium text-heading tracking-[1.8px] uppercase mb-6">
        Color Palette Direction
      </label>
      <div className="flex gap-4">
        {PALETTES.map((palette, i) => (
          <button
            key={palette.name}
            onClick={() => setSelected(i)}
            className={`flex-1 h-24 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity ${
              palette.bg
            } ${palette.text} ${palette.border || ''} ${
              selected === i ? 'ring-1 ring-heading opacity-100' : ''
            }`}
          >
            <span className="text-xs font-medium tracking-[1.8px] uppercase">
              {palette.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
