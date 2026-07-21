'use client'

import { ComingSoonModal } from '@/components/inquiry/ComingSoonModal'
import { StatusCheckWidget } from '@/components/inquiry/StatusCheckWidget'
import { ColorPaletteSelector } from '@/components/inquiry/ColorPaletteSelector'
import { BudgetSlider } from '@/components/inquiry/BudgetSlider'
import { ImageIcon } from 'lucide-react'

export default function InquiryPage() {
  return (
    <>
      <ComingSoonModal />
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 pb-[120px] pt-[95px]">
        <div className="flex flex-col gap-[96px]">
          <header className="flex flex-col gap-[15px]">
            <h1 className="font-serif text-5xl md:text-[64px] text-heading tracking-[-1.28px] leading-[1.1]">
              Bespoke Floral Inquiry
            </h1>
            <p className="text-muted text-lg max-w-[672px] leading-relaxed">
              Commission a tailored botanical arrangement designed to reflect the
              quiet luxury of your vision. Please provide the details below, and
              our atelier will craft a bespoke proposal.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 flex flex-col gap-16">
              {/* Section: Event Details */}
              <section className="flex flex-col gap-8">
                <h2 className="font-serif text-2xl text-heading pb-4 border-b border-border-light">
                  01. Event Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-heading tracking-[1.8px] uppercase">
                      Date
                    </label>
                    <div className="border-b border-border pb-[9px] pt-2">
                      <input
                        type="text"
                        placeholder="mm / dd / yyyy"
                        className="w-full bg-transparent text-base text-heading placeholder:text-placeholder outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-heading tracking-[1.8px] uppercase">
                      Event Type
                    </label>
                    <div className="border-b border-border pb-[9px] pt-2 flex items-center justify-between">
                      <input
                        type="text"
                        placeholder="Select an occasion..."
                        className="w-full bg-transparent text-base text-heading placeholder:text-placeholder outline-none"
                      />
                      <svg width="7" height="5" viewBox="0 0 7 5" fill="none" className="text-charcoal shrink-0">
                        <path d="M3.5 5L0 0H7L3.5 5Z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-heading tracking-[1.8px] uppercase">
                      Location &amp; Venue
                    </label>
                    <div className="border-b border-border pb-[12.59px] pt-[11px]">
                      <input
                        type="text"
                        placeholder="Venue name, City, State"
                        className="w-full bg-transparent text-base text-placeholder outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Design Inspiration */}
              <section className="flex flex-col gap-8">
                <h2 className="font-serif text-2xl text-heading pb-4 border-b border-border-light">
                  02. Design Inspiration
                </h2>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-heading tracking-[1.8px] uppercase mb-4">
                    Share your vision
                  </label>
                  <div className="bg-warm-cream border border-border-light h-64 flex flex-col items-center justify-center gap-4">
                    <ImageIcon size={26} className="text-heading" />
                    <p className="text-xs font-medium text-heading tracking-[1.4px] uppercase">
                      Upload inspiration photos
                    </p>
                    <p className="text-muted text-sm">JPG, PNG, PDF up to 10MB</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-heading tracking-[1.8px] uppercase">
                    Additional Notes
                  </label>
                  <div className="border-b border-border pb-[85px] pt-2">
                    <textarea
                      placeholder="Describe the atmosphere, specific botanical elements desired, or structural requirements..."
                      className="w-full bg-transparent text-base text-placeholder outline-none resize-none h-6"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Preferences */}
              <section className="flex flex-col gap-8">
                <h2 className="font-serif text-2xl text-heading pb-4 border-b border-border-light">
                  03. Preferences
                </h2>
                <div className="flex flex-col gap-12">
                  <ColorPaletteSelector />
                  <BudgetSlider />
                </div>
              </section>

              {/* Submission */}
              <div className="flex items-center gap-6 pt-[33px] border-t border-border-light">
                <button className="px-[41px] py-[17px] bg-black text-white text-sm font-medium tracking-[1.4px] uppercase rounded-none hover:opacity-90 transition-opacity">
                  Submit Inquiry
                </button>
                <p className="text-muted text-sm max-w-[320px]">
                  Our design team reviews inquiries within 48 hours to ensure
                  alignment with our atelier&apos;s aesthetic vision.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="md:col-span-4 flex flex-col gap-12">
              <StatusCheckWidget />
              <div className="w-full overflow-clip">
                <div className="h-[490px] bg-gradient-to-br from-[#e8e4dd] to-[#d4cfc5] relative">
                  <div className="absolute inset-0 bg-overlay" />
                </div>
              </div>
              <div className="border-l border-border-light pl-6">
                <h4 className="text-xs font-medium text-heading tracking-[1.8px] uppercase mb-4">
                  The Zerya Promise
                </h4>
                <p className="text-muted text-sm leading-relaxed">
                  Every commission is a collaboration. We source rare, seasonal
                  botanicals globally, ensuring your arrangement is structurally
                  unique and deeply evocative of your narrative.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
