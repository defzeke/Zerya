import { ShopHeader } from '@/sections/ShopHeader'
import { FilterBar } from '@/sections/FilterBar'
import { ProductGridRow1, ProductGridRow2 } from '@/sections/ProductGrid'
import { InquiryBanner } from '@/sections/InquiryBanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
}

export default function ShopPage() {
  return (
    <>
      <ShopHeader />
      <FilterBar />
      <ProductGridRow1 />
      <InquiryBanner />
      <ProductGridRow2 />
    </>
  )
}
