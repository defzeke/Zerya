import { ChevronDown } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'How far in advance should I book for a wedding?',
    answer:
      'We recommend booking at least 2-3 months in advance for weddings to allow time for consultation, design, and sourcing of seasonal blooms.',
  },
  {
    question: 'Do you offer daily deliveries?',
    answer:
      'Yes, we offer daily deliveries across Metro Manila. Same-day delivery is available for orders placed before 12PM.',
  },
  {
    question: 'Can I request specific flower varieties?',
    answer:
      'Absolutely. We source rare and seasonal botanicals globally. Our team will work with you to source specific varieties based on availability.',
  },
] as const

export function FAQ() {
  return (
    <section className="border-t border-border-light py-[120px] px-4 md:px-16">
      <div className="max-w-[640px] mx-auto">
        <h2 className="font-serif text-2xl text-heading text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border-b border-border-light pb-[17px]"
            >
              <button className="w-full flex items-center justify-between text-left">
                <span className="text-base font-medium text-heading">
                  {item.question}
                </span>
                <ChevronDown size={12} className="text-charcoal shrink-0 ml-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
