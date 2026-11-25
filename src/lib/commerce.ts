import type { CurrencyCode, RegionCode } from '../types'

export const fx: Record<CurrencyCode, number> = { USD:1, GBP:0.79, EUR:0.92, INR:83.12, JPY:150.4 }
export const symbols: Record<CurrencyCode, string> = { USD:'$', GBP:'£', EUR:'€', INR:'₹', JPY:'¥' }
export const regionNames: Record<RegionCode, string> = { US:'United States', UK:'United Kingdom', EU:'European Union', IN:'India', JP:'Japan' }
export const currencyByRegion: Record<RegionCode, CurrencyCode> = { US:'USD', UK:'GBP', EU:'EUR', IN:'INR', JP:'JPY' }
export const taxRates: Record<RegionCode, number> = { US:.0825, UK:.20, EU:.21, IN:.18, JP:.10 }

export function convert(usd: number, currency: CurrencyCode) {
  const converted = usd * fx[currency]
  return currency === 'JPY' ? Math.round(converted) : converted
}
export function formatCurrency(usd: number, currency: CurrencyCode) {
  const value = convert(usd, currency)
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style:'currency', currency, maximumFractionDigits: currency === 'JPY' ? 0 : 2
  }).format(value)
}
