import { StoryHero } from '@/sections/StoryHero'
import { BeginningSection } from '@/sections/BeginningSection'
import { PhilosophySection } from '@/sections/PhilosophySection'
import { AtelierSection } from '@/sections/AtelierSection'
import { FinalCTA } from '@/sections/FinalCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story',
}

export default function StoryPage() {
  return (
    <>
      <StoryHero />
      <BeginningSection />
      <PhilosophySection />
      <AtelierSection />
      <FinalCTA />
    </>
  )
}
