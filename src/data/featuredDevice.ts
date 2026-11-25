import type { DeviceProduct } from '@/components/ui/device-product-hero'

export const featuredDevice: DeviceProduct = {
  id: 'apple-iphone-15-pro',
  name: 'Apple iPhone 15 Pro',
  brand: 'APPLE',
  brandTag: 'APPLE / PRO LINEUP',
  seriesLabel: 'IPHONE 15 PRO / TITANIUM',
  sku: 'APL-IP15P',
  headline: 'Pro in every detail.',
  subheadline: 'A17 Pro performance, an always-on Super Retina XDR display, and an advanced 48 MP camera system in a titanium design.',
  highlights: ['6.1″ Super Retina XDR', 'A17 Pro · 3 nm', '48 MP Pro camera'],
  finishes: [
    {
      id: 'natural-titanium',
      name: 'Natural Titanium',
      skuSuffix: '-NAT',
      swatch: '#cbd0d7',
      tint: '#9da7b5',
      images: [
        { label: 'Front & rear', src: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1400&q=90' },
        { label: 'Display', src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=90' },
        { label: 'Camera detail', src: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1400&q=90', focus: [0.72, 0.4], zoom: 2.2 }
      ]
    },
    {
      id: 'black-titanium',
      name: 'Black Titanium',
      skuSuffix: '-BLK',
      swatch: '#17191f',
      tint: '#697386',
      images: [
        { label: 'Front & rear', src: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1400&q=90' },
        { label: 'Display', src: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1400&q=90' },
        { label: 'Camera detail', src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=90', focus: [0.72, 0.4], zoom: 2.2 }
      ]
    },
    {
      id: 'blue-titanium',
      name: 'Blue Titanium',
      skuSuffix: '-BLU',
      swatch: '#253653',
      tint: '#456a9e',
      images: [
        { label: 'Front & rear', src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=90' },
        { label: 'Display', src: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1400&q=90' },
        { label: 'Camera detail', src: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1400&q=90', focus: [0.72, 0.4], zoom: 2.2 }
      ]
    }
  ],
  specifications: [
    { id: '128gb', label: '128 GB', priceINR: 134900, mrpINR: 139900, skuSuffix: '-128' },
    { id: '256gb', label: '256 GB', priceINR: 144900, mrpINR: 149900, skuSuffix: '-256' },
    { id: '512gb', label: '512 GB', priceINR: 164900, mrpINR: 169900, skuSuffix: '-512' }
  ]
}
