'use client'

import { Search } from 'lucide-react'

export function StatusCheckWidget() {
  return (
    <div className="bg-footer border border-border-light p-[33px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-[13px] rounded-full bg-heading" />
        <h3 className="font-serif text-2xl text-heading">Track Inquiry</h3>
      </div>
      <p className="text-muted text-sm mb-6 leading-relaxed">
        Enter your reference number to view the status of an existing proposal or
        commission.
      </p>
      <div className="flex items-start pt-2">
        <div className="flex-1 border-b border-border pb-[12.59px] pt-[11px]">
          <input
            type="text"
            placeholder="Ref No."
            className="w-full bg-transparent text-base text-heading placeholder:text-placeholder outline-none"
          />
        </div>
        <div className="border-b border-border flex items-center justify-center pb-[17.79px] pt-[4.8px] px-2">
          <Search size={14} className="text-charcoal" />
        </div>
      </div>
    </div>
  )
}
