export function BeginningSection() {
  return (
    <section className="py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex gap-6 items-center">
        <div className="hidden md:block w-5/12">
          <div className="aspect-[3/4] bg-gradient-to-br from-[#e2ded5] to-[#ccc8be] w-full" />
        </div>
        <div className="w-full md:w-6/12 flex flex-col gap-8">
          <p className="text-xs font-medium text-charcoal tracking-[2.4px] uppercase">
            The Beginning
          </p>
          <h2 className="font-serif text-[40px] leading-[48px] text-heading">
            Rooted in the quiet heritage of
            <br />
            artisanal craft.
          </h2>
          <div className="flex flex-col gap-6">
            <p className="font-sans text-lg font-light text-charcoal leading-[28.8px]">
              Zerya Blooms was born from a singular vision: to treat the floral
              <br />
              arrangement not as a commodity, but as a fleeting piece of
              <br />
              living sculpture. Founded in a small, sun-lit atelier, we began
              <br />
              with a simple commitment to local, seasonal blooms and the
              <br />
              intentionality of hand-selected stems.
            </p>
            <p className="font-sans text-lg font-light text-charcoal leading-[28.8px]">
              Our heritage is defined by a deep respect for the botanical
              <br />
              cycle. We believe that true luxury lies in the authentic, the
              <br />
              organic, and the perfectly imperfect forms found in nature&apos;s
              <br />
              quietest corners.
            </p>
          </div>
        </div>
      </div>
      {/* Mobile image */}
      <div className="md:hidden mt-6">
        <div className="aspect-[3/4] bg-gradient-to-br from-[#e2ded5] to-[#ccc8be] w-full max-w-sm mx-auto" />
      </div>
    </section>
  )
}
