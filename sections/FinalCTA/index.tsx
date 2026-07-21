import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="border-t border-border-light py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 flex flex-col items-center gap-12">
        <h2 className="font-serif text-[40px] leading-[48px] text-heading text-center">
          Every bloom has a story.
          <br />
          Let us help tell yours.
        </h2>
        <div className="flex gap-6 items-start justify-center">
          <Link
            href="/inquiry"
            className="inline-flex items-center justify-center px-[49px] py-[21px] bg-black text-white text-sm font-medium tracking-[1.4px] uppercase"
          >
            Start Your Journey
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-[49px] py-[21px] border border-placeholder text-black text-sm font-medium tracking-[1.4px] uppercase"
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
