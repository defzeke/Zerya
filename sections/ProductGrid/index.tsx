import Link from 'next/link'

interface Product {
  name: string
  price: string
}

const ROW_1: Product[] = [
  { name: 'The Silk Peony', price: '$145.00' },
  { name: 'Verdant Whisper', price: '$180.00' },
  { name: 'Modern Blush', price: '$165.00' },
]

const ROW_2: Product[] = [
  { name: 'The Lunar Collection', price: '$210.00' },
  { name: 'Eternal Harvest', price: '$130.00' },
  { name: 'The Zen Bloom', price: '$195.00' },
]

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex-1 flex flex-col min-w-px">
      <div className="bg-footer w-full overflow-clip mb-6">
        <div className="h-[460px] bg-gradient-to-br from-[#e8e4dd] to-[#d4cfc5]" />
      </div>
      <h3 className="font-serif text-2xl text-heading leading-[31.2px]">{product.name}</h3>
      <p className="text-charcoal text-base leading-6 mt-0">{product.price}</p>
    </div>
  )
}

export function ProductGridRow1() {
  return (
    <section className="py-[120px] px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex gap-6 items-start justify-center">
        {ROW_1.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  )
}

export function ProductGridRow2() {
  return (
    <section className="py-[120px] px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex gap-6 items-start justify-center">
        {ROW_2.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
      <div className="flex items-center justify-center pt-24">
        <Link
          href="/shop"
          className="border border-black px-[49px] py-[21px] text-sm font-medium text-black text-center tracking-[1.4px] uppercase"
        >
          Load More Designs
        </Link>
      </div>
    </section>
  )
}
