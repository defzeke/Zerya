import Link from 'next/link'

export function InquiryBanner() {
  return (
    <section className="bg-warm-cream border-y border-border-light">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 flex flex-col items-center gap-6 py-24">
        <p className="text-xs font-medium text-charcoal text-center tracking-[2.4px] uppercase">
          Bespoke Artistry
        </p>
        <h2 className="font-serif text-[40px] leading-[48px] text-heading text-center max-w-[768px] pb-2">
          Looking for something truly singular? Our
          <br />
          atelier creates custom floral installations
          <br />
          for discerning clients.
        </h2>
        <Link
          href="/inquiry"
          className="inline-flex items-center justify-center px-[41px] py-[17px] bg-black text-white text-sm font-medium tracking-[1.4px] uppercase"
        >
          Submit Custom Inquiry
        </Link>
      </div>
    </section>
  )
}
