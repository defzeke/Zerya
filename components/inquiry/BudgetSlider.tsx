'use client'

import { useState } from 'react'

export function BudgetSlider() {
  const [value, setValue] = useState(40)

  return (
    <div className="pt-4">
      <div className="flex items-end justify-between mb-4">
        <label className="text-xs font-medium text-heading tracking-[1.8px] uppercase">
          Estimated Investment
        </label>
        <span className="text-muted text-base">
          ${value >= 90 ? '25,000+' : value <= 10 ? '1,000' : `${(value * 100).toLocaleString()}`}
        </span>
      </div>
      <div className="relative">
        <div className="bg-[#e4e2dd] h-[2px] rounded-full w-full">
          <div
            className="bg-heading h-[2px] rounded-full"
            style={{ width: `${value}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 size-4 bg-heading border-2 border-cream rounded-full pointer-events-none"
          style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between mt-4 opacity-50">
        <span className="text-xs font-medium text-placeholder tracking-[1.8px]">$1k</span>
        <span className="text-xs font-medium text-placeholder tracking-[1.8px]">Bespoke Minimum</span>
        <span className="text-xs font-medium text-placeholder tracking-[1.8px]">$25k+</span>
      </div>
    </div>
  )
}
