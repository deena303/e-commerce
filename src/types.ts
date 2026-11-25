export type RegionCode = 'US' | 'UK' | 'EU' | 'IN' | 'JP'
export type CurrencyCode = 'USD' | 'GBP' | 'EUR' | 'INR' | 'JPY'
export type Warehouse = 'North America Hub' | 'EU Central Hub' | 'Asia-Pacific Hub'

export interface ProductVariantOption {
  id: string
  label: string
  priceDeltaUSD: number
  skuSuffix: string
  inStock: boolean
  imageOverride?: string
}

export interface ProductSpecGroup {
  name: string
  options: ProductVariantOption[]
}

export interface Product {
  id: string
  name: string
  sku: string
  basePriceUSD: number
  brand: string
  category: 'Custom PCs & GPUs' | 'Audio & Peripherals' | 'Smart Displays' | 'Modular Power' | 'Mobile & Smart Devices'
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  warehouse: Warehouse
  weight: number
  maxStock: number
  expressEligible: boolean
  image: string
  images: string[]
  specs: string[]
  specGroups: ProductSpecGroup[]
  badge?: string
}

export interface CartItem {
  productId: string
  quantity: number
  warranty: 'Standard' | '2-Year' | '3-Year'
  giftWrap: boolean
  variant?: string
  priceDelta?: number
  sku?: string
  configuredPrice?: number
}
