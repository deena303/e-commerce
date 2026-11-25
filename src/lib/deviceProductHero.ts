import type { DeviceFinish, DeviceImageView, DeviceProduct, DeviceSpecification } from '@/components/ui/device-product-hero'
import { featuredDevice } from '@/data/featuredDevice'
import { fx } from '@/lib/commerce'
import type { Product, ProductVariantOption } from '@/types'

function swatchFor(label: string) {
  const value = label.toLowerCase()
  if (value.includes('gold')) return { swatch: '#c9a45c', tint: '#d8bd83' }
  if (value.includes('blue')) return { swatch: '#2d4d78', tint: '#6f8fb7' }
  if (value.includes('silver') || value.includes('natural')) return { swatch: '#cbd0d7', tint: '#9da7b5' }
  if (value.includes('black') || value.includes('graphite')) return { swatch: '#25282e', tint: '#747b87' }
  return { swatch: '#9ca3af', tint: '#c4c9d0' }
}

function viewsFor(sources: string[]): DeviceImageView[] {
  const uniqueSources = [...new Set(sources.filter(Boolean))]
  return uniqueSources.map((src, index) => ({
    label: uniqueSources.length === 1 ? 'Product view' : `View ${index + 1}`,
    src
  }))
}

function combinationsFor(groups: Product['specGroups']): ProductVariantOption[][] {
  return groups.reduce<ProductVariantOption[][]>(
    (combinations, group) => combinations.flatMap((combination) =>
      group.options.map((option) => [...combination, option])
    ),
    [[]]
  )
}

export function toDeviceProductHero(product: Product): DeviceProduct {
  if (product.id === featuredDevice.id) {
    return {
      ...featuredDevice,
      rating: product.rating,
      reviews: product.reviews,
      maxStock: product.maxStock
    }
  }

  const finishGroup = product.specGroups.find((group) =>
    ['finish', 'chassis finish'].includes(group.name.trim().toLowerCase())
  )
  const configurationGroups = product.specGroups.filter((group) => group !== finishGroup)
  const baseImages = [product.image, ...product.images]
  const finishes: DeviceFinish[] = finishGroup
    ? finishGroup.options.map((option) => {
      const colors = swatchFor(option.label)
      return {
        id: option.id,
        name: option.label.replace(/\s+finish\b/i, ''),
        skuSuffix: option.skuSuffix,
        priceDeltaUSD: option.priceDeltaUSD,
        inStock: option.inStock,
        ...colors,
        images: viewsFor([option.imageOverride ?? '', ...baseImages])
      }
    })
    : [{
      id: 'standard',
      name: 'Standard',
      skuSuffix: '',
      swatch: '#9ca3af',
      tint: '#c4c9d0',
      images: viewsFor(baseImages)
    }]

  const optionCombinations = combinationsFor(configurationGroups)
  const specifications: DeviceSpecification[] = optionCombinations.map((options) => {
    const priceDelta = options.reduce((total, option) => total + option.priceDeltaUSD, 0)
    const priceUSD = product.basePriceUSD + priceDelta
    const mrpUSD = product.originalPrice === undefined ? undefined : product.originalPrice + priceDelta
    return {
      id: options.map((option) => option.id).join('-') || 'standard',
      label: options.map((option) => option.label).join(' · ') || 'Standard configuration',
      priceINR: priceUSD * fx.INR,
      mrpINR: mrpUSD === undefined ? undefined : mrpUSD * fx.INR,
      skuSuffix: options.map((option) => option.skuSuffix).join(''),
      inStock: options.every((option) => option.inStock)
    }
  })

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    brandTag: `${product.brand} / GLOBAL HARDWARE`,
    seriesLabel: product.category.toUpperCase(),
    sku: product.sku,
    headline: product.name,
    subheadline: `${product.specs.join(' · ')}. Ships from ${product.warehouse} with verified global support.`,
    highlights: product.specs,
    finishes,
    specifications,
    configurationLabel: configurationGroups.length > 1 ? 'Select configuration' : `Select ${configurationGroups[0]?.name ?? 'configuration'}`,
    rating: product.rating,
    reviews: product.reviews,
    maxStock: product.maxStock
  }
}
