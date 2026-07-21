export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://zeryablooms.com/#business',
  name: 'Zerya Blooms',
  description:
    'Boutique floral shop in Metro Manila offering ready-made bouquets and custom floral arrangements. Same-day delivery available.',
  url: 'https://zeryablooms.com',
  telephone: '+63-XXX-XXX-XXXX',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Floral Street',
    addressLocality: 'Makati',
    addressRegion: 'Metro Manila',
    postalCode: '1200',
    addressCountry: 'PH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 14.5995,
    longitude: 120.9842,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://zeryablooms.com/#organization',
  name: 'Zerya Blooms',
  url: 'https://zeryablooms.com',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+63-XXX-XXX-XXXX',
    contactType: 'customer service',
  },
  sameAs: [
    'https://instagram.com/zeryablooms',
    'https://pinterest.com/zeryablooms',
  ],
}
