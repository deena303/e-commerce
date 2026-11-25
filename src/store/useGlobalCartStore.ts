import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CurrencyCode, RegionCode, Warehouse } from '../types'
import { mockCatalog } from '../data/mockCatalog'

export interface ToastItem { id: number; message: string; type?: 'success' | 'error' }

interface GlobalCartState {
  cartItems: CartItem[]
  savedItems: CartItem[]
  selectedRegion: RegionCode
  selectedCurrency: CurrencyCode
  appliedCoupon: string | null
  selectedShippingMethods: Record<Warehouse, 'standard' | 'express'>
  toastQueue: ToastItem[]
  cartOpen: boolean
  checkoutOpen: boolean
  wishlist: string[]
  orderHistory: CompletedOrder[]
  addToCart: (productId: string, quantity?: number, variant?: string, priceDelta?: number, sku?: string, configuredPrice?: number) => void
  updateQuantity: (productId: string, quantity: number, variant?: string) => void
  removeFromCart: (productId: string, variant?: string) => void
  saveForLater: (productId: string, variant?: string) => void
  moveToCart: (productId: string, variant?: string) => void
  setRegionCurrency: (region: RegionCode, currency: CurrencyCode) => void
  setCoupon: (coupon: string | null) => void
  setShippingMethod: (warehouse: Warehouse, method: 'standard' | 'express') => void
  addToast: (message: string, type?: 'success' | 'error') => void
  setCartOpen: (open: boolean) => void
  setCheckoutOpen: (open: boolean) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  completeOrder: (order: CompletedOrder) => void
}

export interface CompletedOrder {
  id: string
  items: CartItem[]
  subtotal: number
  total: number
  currency: CurrencyCode
  region: RegionCode
  tracking: Record<string, string>
  createdAt: string
}

export const useGlobalCartStore = create<GlobalCartState>()(persist((set, get) => ({
  cartItems: [],
  savedItems: [],
  wishlist: [],
  orderHistory: [],
  selectedRegion: 'IN',
  selectedCurrency: 'INR',
  appliedCoupon: null,
  selectedShippingMethods: {
    'North America Hub': 'standard',
    'EU Central Hub': 'standard',
    'Asia-Pacific Hub': 'standard'
  },
  toastQueue: [],
  cartOpen: false,
  checkoutOpen: false,
  addToCart: (productId, quantity = 1, variant, priceDelta = 0, sku, configuredPrice) => set((state) => {
    const existing = state.cartItems.find((item) => item.productId === productId && item.variant === variant)
    const maxStock = mockCatalog.find((product) => product.id === productId)?.maxStock || quantity
    return { cartItems: existing
      ? state.cartItems.map((item) => item.productId === productId && item.variant === variant ? { ...item, quantity: Math.min(maxStock, item.quantity + quantity) } : item)
      : [...state.cartItems, { productId, quantity, warranty: 'Standard', giftWrap: false, variant, priceDelta, sku, configuredPrice }],
      cartOpen: false
    }
  }),
  updateQuantity: (productId, quantity, variant) => set((state) => {
    const maxStock = mockCatalog.find((product) => product.id === productId)?.maxStock || quantity
    return { cartItems: state.cartItems.map((item) =>
      item.productId === productId && (variant === undefined || item.variant === variant)
        ? { ...item, quantity: Math.min(maxStock, Math.max(1, quantity)) }
        : item
    )}
  }),
  removeFromCart: (productId, variant) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.productId !== productId || (variant !== undefined && item.variant !== variant))
  })),
  saveForLater: (productId, variant) => set((state) => {
    const item = state.cartItems.find((entry) => entry.productId === productId && (variant === undefined || entry.variant === variant))
    return item ? {
      cartItems: state.cartItems.filter((entry) => entry.productId !== productId || (variant !== undefined && entry.variant !== variant)),
      savedItems: [...state.savedItems, item]
    } : {}
  }),
  moveToCart: (productId, variant) => set((state) => {
    const item = state.savedItems.find((entry) => entry.productId === productId && (variant === undefined || entry.variant === variant))
    if (!item) return {}
    const existing = state.cartItems.find((entry) => entry.productId === productId && entry.variant === item.variant)
    const maxStock = mockCatalog.find((product) => product.id === productId)?.maxStock || item.quantity
    return {
      savedItems: state.savedItems.filter((entry) => entry.productId !== productId || (variant !== undefined && entry.variant !== variant)),
      cartItems: existing
        ? state.cartItems.map((entry) => entry.productId === productId && entry.variant === item.variant
          ? { ...entry, quantity: Math.min(maxStock, entry.quantity + item.quantity) }
          : entry)
        : [...state.cartItems, item]
    }
  }),
  setRegionCurrency: (selectedRegion, selectedCurrency) => set({ selectedRegion, selectedCurrency }),
  setCoupon: (appliedCoupon) => set({ appliedCoupon }),
  setShippingMethod: (warehouse, method) => set((state) => ({
    selectedShippingMethods: { ...state.selectedShippingMethods, [warehouse]: method }
  })),
  addToast: (message, type = 'success') => set((state) => ({
    toastQueue: [...state.toastQueue, { id: Date.now(), message, type }].slice(-3)
  })),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setCheckoutOpen: (checkoutOpen) => set({ checkoutOpen })
  ,
  clearCart: () => set({ cartItems: [] }),
  toggleWishlist: (productId) => set((state) => ({
    wishlist: state.wishlist.includes(productId)
      ? state.wishlist.filter((id) => id !== productId)
      : [...state.wishlist, productId]
  })),
  completeOrder: (order) => set((state) => ({ orderHistory: [order, ...state.orderHistory] }))
}), { name: 'global-cart-store' }))
