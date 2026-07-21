export function StoryHero() {
  return (
    <section className="relative min-h-[640px] flex items-center justify-center overflow-clip">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e2ded5] to-[#c5c1b7]" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative flex flex-col items-center gap-0 px-4">
        <h1 className="font-serif text-5xl md:text-[64px] leading-[1.1] tracking-[-1.28px] text-[#1b1c19] text-center">
          Our Story
        </h1>
        <div className="pt-8">
          <div className="w-12 h-px bg-black" />
        </div>
      </div>
    </section>
  )
}
