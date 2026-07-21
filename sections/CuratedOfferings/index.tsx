import Link from 'next/link'

const OFFERINGS = [
  {
    name: 'Signature Bouquets',
    description: 'Timeless arrangements for everyday elegance.',
  },
  {
    name: 'Seasonal Blooms',
    description: "Fresh, organic selections reflecting nature's rhythm.",
  },
  {
    name: 'Event Styling',
    description: 'Bespoke floral installations for memorable occasions.',
  },
] as const

export function CuratedOfferings() {
  return (
    <section className="py-[119px] px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex flex-col items-center gap-4 mb-16">
        <h2 className="font-serif text-2xl text-heading text-center">
          Curated Offerings
        </h2>
        <div className="w-16 h-px bg-border-light" />
      </div>
      <div className="flex gap-6 items-start">
        {OFFERINGS.map((item, i) => {
          const offset = i === 1 ? 'pt-[48px]' : ''
          const pb = i !== 1 ? 'pb-[48px]' : ''
          return (
            <Link
              key={item.name}
              href={`/shop?collection=${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex-1 flex flex-col gap-[23px] ${offset} ${pb}`}
            >
              <div className="bg-[#f0eee9] w-full overflow-clip">
                <div className="h-[460px] bg-gradient-to-br from-[#e8e4dd] to-[#d4cfc5]" />
              </div>
              <div className="flex flex-col gap-[7px] items-center">
                <h3 className="font-serif text-2xl text-heading text-center">
                  {item.name}
                </h3>
                <p className="text-charcoal text-center text-base">
                  {item.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
