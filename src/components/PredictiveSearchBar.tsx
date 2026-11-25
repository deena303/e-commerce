import { useMemo, useState } from 'react'
import { Search, ShoppingBag } from 'lucide-react'
import { mockCatalog } from '../data/mockCatalog'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { formatCurrency } from '../lib/commerce'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../types'

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function scoreProduct(product: Product, rawQuery: string) {
  const tokens = normalize(rawQuery).split(/\s+/).filter(Boolean)
  const searchable = normalize(`${product.name} ${product.brand} ${product.id} ${product.category} ${product.specs.join(' ')}`)
  if (!tokens.length) return 0
  if (!tokens.every((token) => searchable.includes(token))) return 0
  const name = normalize(product.name)
  return tokens.reduce((score, token) =>
    score + (name.includes(token) ? 4 : 0) + (normalize(product.brand).includes(token) ? 3 : 0) + (normalize(product.id).includes(token) ? 3 : 0), 0
  ) + tokens.length
}

export default function PredictiveSearchBar({ compact=false }: { compact?: boolean }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { addToCart, selectedCurrency } = useGlobalCartStore()
  const normalizedQuery = normalize(query)

  const results = useMemo(() => {
    if (!normalizedQuery) return []
    return mockCatalog
      .map((product) => ({ product, score: scoreProduct(product, normalizedQuery) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.product)
  }, [normalizedQuery])

  const submitSearch = () => {
    const cleanQuery = query.trim()
    if (cleanQuery) navigate(`/products?search=${encodeURIComponent(cleanQuery)}`)
  }

  const resetSearch = () => {
    setQuery('')
    navigate('/products')
  }

  return (
    <div className={`relative ${compact ? 'w-full' : 'w-full max-w-xl'}`}>
      <Search className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-graphite/50" size={17}/>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            submitSearch()
          }
        }}
        placeholder="Search hardware, SKU, brand..."
        aria-label="Search catalog"
        className="h-11 w-full rounded-full border border-transparent bg-white pl-11 pr-4 text-sm text-graphite shadow-sm placeholder:text-graphite/45"
      />
      {focused && normalizedQuery && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-graphite/10 bg-white p-2 shadow-premium">
          {results.length ? results.map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-offwhite"
            >
              <img src={product.image} alt="" className="h-11 w-11 rounded-lg object-cover"/>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{product.name}</span>
                <span className="block text-xs text-graphite/55">{product.brand} · {formatCurrency(product.price, selectedCurrency)}</span>
              </span>
              <span
                role="button"
                aria-label={`Quick add ${product.name}`}
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); addToCart(product.id) }}
                className="grid h-9 w-9 place-items-center rounded-full bg-cobalt text-white"
              ><ShoppingBag size={15}/></span>
            </button>
          )) : (
            <div className="px-3 py-4 text-center">
              <p className="text-sm font-bold">No matching hardware found for "{query.trim()}"</p>
              <button type="button" onClick={resetSearch} className="mt-3 h-10 rounded-full bg-cobalt px-4 text-xs font-black text-white">Reset Search & Filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
