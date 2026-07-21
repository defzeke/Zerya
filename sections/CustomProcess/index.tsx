import Link from 'next/link'
import { Image, MessageSquareText, Truck } from 'lucide-react'

const STEPS = [
  {
    number: 1,
    icon: Image,
    title: 'Share Inspiration',
    description:
      'Provide your mood boards, color palettes, and the emotion you wish to convey.',
  },
  {
    number: 2,
    icon: MessageSquareText,
    title: 'Consult & Quote',
    description:
      'We collaborate to refine the vision and provide a detailed, bespoke proposal.',
  },
  {
    number: 3,
    icon: Truck,
    title: 'Hand-Delivered Magic',
    description:
      'Our artisans meticulously craft and install your florals on the day of the event.',
  },
] as const

export function CustomProcess() {
  return (
    <section className="py-[119px] px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex flex-col items-center gap-4 mb-16">
        <h2 className="font-serif text-2xl text-heading text-center">
          The Custom Process
        </h2>
        <p className="text-charcoal text-base text-center">
          From inspiration to installation.
        </p>
      </div>
      <div className="flex gap-16 items-start justify-center">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              className="bg-cream flex-1 flex flex-col items-center px-4 max-w-[341px]"
            >
              <div className="bg-cream border border-black rounded-full size-16 flex items-center justify-center mb-6">
                <Icon size={21} className="text-heading" />
              </div>
              <h3 className="text-xs font-medium text-heading tracking-[1.8px] uppercase mb-4">
                {step.number}. {step.title}
              </h3>
              <p className="text-charcoal text-base text-center max-w-[320px]">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center mt-16">
        <Link
          href="/inquiry"
          className="inline-flex items-center justify-center px-[33px] py-[17px] bg-black text-white text-sm font-medium tracking-[1.4px] uppercase rounded-none hover:opacity-90 transition-opacity"
        >
          Start Your Inquiry
        </Link>
      </div>
    </section>
  )
}
