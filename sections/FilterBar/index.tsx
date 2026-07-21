const FILTERS = ['Occasion', 'Style', 'Price'] as const

export function FilterBar() {
  return (
    <div className="sticky top-24 z-40 bg-cream/95 backdrop-blur-[2px] border-b border-border-light">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 flex items-center justify-between py-4">
        <div className="flex gap-8 items-center">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className="flex items-center gap-1.5 text-xs font-medium text-charcoal uppercase tracking-[1.2px] cursor-default"
            >
              {f}
              <svg width="7" height="4" viewBox="0 0 7 4" fill="none" className="mt-0.5">
                <path d="M0.5 0.5L3.5 3.5L6.5 0.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
        <span className="text-xs text-charcoal/60 tracking-[1.8px]">Showing 12 Designs</span>
      </div>
    </div>
  )
}
