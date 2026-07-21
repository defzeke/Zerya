const STEPS = [
  { label: 'I. Selection', gradient: 'from-[#e2ded5] to-[#c5c1b7]' },
  { label: 'II. Process', gradient: 'from-[#dbd6cb] to-[#c2bcae]' },
  { label: 'III. Creation', gradient: 'from-[#e8e4dd] to-[#d4cfc5]' },
] as const

export function AtelierSection() {
  return (
    <section className="py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-[20.59px] pt-[6px]">
          <p className="text-xs font-medium text-charcoal tracking-[2.4px] uppercase">
            The Atelier
          </p>
          <h2 className="font-serif text-[40px] leading-[48px] text-heading">
            A sanctuary of intentionality.
          </h2>
        </div>
        <div className="flex gap-6 items-start justify-center">
          {STEPS.map((step) => (
            <div key={step.label} className="flex-1 flex flex-col gap-[15px] min-w-px">
              <div className="overflow-clip w-full">
                <div className={`h-[368px] bg-gradient-to-br ${step.gradient}`} />
              </div>
              <p className="text-xs font-medium text-charcoal tracking-[1.8px] uppercase">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
