import { Hero } from '@/sections/Hero'
import { CuratedOfferings } from '@/sections/CuratedOfferings'
import { Philosophy } from '@/sections/Philosophy'
import { CustomProcess } from '@/sections/CustomProcess'
import { FAQ } from '@/sections/FAQ'
import { localBusinessSchema } from '@/lib/schema'

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <CuratedOfferings />
      <Philosophy />
      <CustomProcess />
      <FAQ />
    </>
  )
}
