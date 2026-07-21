import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-footer border-t border-border-light">
      <div className="mx-auto max-w-[1280px] px-4 md:px-16 py-16">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/" className="font-serif text-2xl text-heading">
              Zerya Blooms
            </Link>
            <p className="text-charcoal text-sm mt-8">
              &copy; 2026 Zerya Blooms. All Rights Reserved.
            </p>
          </div>
          <div className="flex gap-12">
            <Link href="/faq" className="text-charcoal hover:text-heading transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="text-charcoal hover:text-heading transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-charcoal hover:text-heading transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
