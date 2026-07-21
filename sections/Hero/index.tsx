import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[819px] flex items-center justify-center overflow-clip">
      <div className="absolute inset-0 bg-gradient-to-br from-[#dbdad5] to-[#c8c5be]" />
      <div className="absolute inset-0 bg-overlay" />
      <div className="relative max-w-[1280px] px-4 md:px-16 w-full">
        <div className="max-w-[768px] mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-white tracking-[-1.6px] leading-[1.1] drop-shadow-[0_2px_1px_rgba(0,0,0,0.06),0_4px_1.5px_rgba(0,0,0,0.07)] mb-12">
            Serving Love That Blooms
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-[33px] py-[17px] bg-black text-white text-sm font-medium tracking-[1.4px] uppercase rounded-none hover:opacity-90 transition-opacity"
            >
              Shop the Collection
            </Link>
            <Link
              href="/inquiry"
              className="inline-flex items-center justify-center px-[33px] py-[17px] border border-white text-white text-sm font-medium tracking-[1.4px] uppercase rounded-none hover:bg-white hover:text-black transition-colors"
            >
              Custom Inquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
