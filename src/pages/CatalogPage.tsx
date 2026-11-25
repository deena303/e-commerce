import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { mockCatalog } from '../data/mockCatalog'
import ProductCard from '../components/ProductCard'
import FilterDrawer, { type CatalogFilters } from '../components/FilterDrawer'
import QuickViewModal from '../components/QuickViewModal'
import type { Product } from '../types'

const categoryMap: Record<string, string> = {
  gpus: 'Custom PCs & GPUs',
  'PC & GPU': 'Custom PCs & GPUs',
  audio: 'Audio & Peripherals',
  Audio: 'Audio & Peripherals',
  displays: 'Smart Displays',
  Displays: 'Smart Displays',
  power: 'Modular Power',
  Power: 'Modular Power',
  mobile: 'Mobile & Smart Devices',
  Mobile: 'Mobile & Smart Devices'
}

const defaultFilters: CatalogFilters = {
  warehouses: [],
  brands: [],
  maxPrice: 2500,
  minRating: 0,
  expressOnly: false
}

function relevance(product: Product, rawQuery: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const queryTokens = normalize(rawQuery).split(/\s+/).filter(Boolean)
  const haystack = normalize(`${product.name} ${product.brand} ${product.id} ${product.category} ${product.specs.join(' ')}`)
  if (!queryTokens.length) return 1
  if (!queryTokens.every((token) => haystack.includes(token))) return 0
  const name = normalize(product.name)
  let score = 0
  queryTokens.forEach((token) => {
    if (name.includes(token)) score += 4
    if (normalize(product.brand).includes(token)) score += 3
    if (normalize(product.id).includes(token)) score += 3
  })
  return score + queryTokens.length
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<CatalogFilters>(defaultFilters)
  const [quick, setQuick] = useState<Product | null>(null)
  const [sort, setSort] = useState('featured')

  const category = params.get('category')
  const warehouse = params.get('warehouse')
  const deals = params.get('deals') === 'true'
  const search = params.get('search')?.trim().toLowerCase() || ''
  const categoryName = category ? categoryMap[category] : ''

  const products = useMemo(() => {
    let result = mockCatalog.filter((product) => {
      const warehouseParamMatch = !warehouse || product.warehouse === (warehouse === 'North America' ? 'North America Hub' : warehouse === 'EU Central' ? 'EU Central Hub' : 'Asia-Pacific Hub')
      const warehouseMatch = !filters.warehouses.length || filters.warehouses.some((origin) =>
        product.warehouse.startsWith(origin === 'North America' ? 'North America' : origin === 'EU Central' ? 'EU Central' : 'Asia-Pacific')
      )
      const brandMatch = !filters.brands.length || filters.brands.includes(product.brand)
      return (!search
        ? (!categoryName || categoryName === product.category)
        : relevance(product, search) > 0)
        && warehouseParamMatch
        && (!deals || !!product.originalPrice)
        && warehouseMatch
        && brandMatch
        && product.price <= filters.maxPrice
        && product.rating >= filters.minRating
        && (!filters.expressOnly || product.expressEligible)
    })

    if (search) {
      result = result
        .filter((product) => relevance(product, search) > 0)
        .sort((a, b) => relevance(b, search) - relevance(a, search))
    }
    if (sort === 'price') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)
    return result
  }, [categoryName, search, filters, sort])

  const activeFilterCount = filters.warehouses.length + filters.brands.length
    + (filters.maxPrice < 2500 ? 1 : 0) + (filters.minRating > 0 ? 1 : 0) + (filters.expressOnly ? 1 : 0)

  const selectCategory = (value: string) => {
    if (value === 'all') setParams({})
    else setParams({ category: value })
  }

  const clearAll = () => setFilters(defaultFilters)

  const activeCategory = category || 'all'
  const heading = search
    ? `Results for "${params.get('search')}"`
    : categoryName || 'All hardware'

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Catalog / Global inventory</p>
        <h1 className="mt-1 text-3xl font-black">{heading}</h1>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-graphite/[.08] bg-white p-3 lg:flex-row lg:items-center">
        <button onClick={() => setDrawerOpen(true)} className="relative flex h-11 shrink-0 items-center gap-2 rounded-full bg-graphite px-4 text-xs font-black text-white">
          <SlidersHorizontal size={16} className="text-gold" />
          Filters
          {activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[10px] text-graphite">{activeFilterCount}</span>}
        </button>
        <div className="scrollbar-hide flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {[['all','All'],['gpus','PC & GPU'],['audio','Audio'],['displays','Displays'],['power','Power'],['mobile','Mobile']].map(([value,label]) => (
            <button key={value} onClick={() => selectCategory(value)} className={`h-9 shrink-0 rounded-full px-4 text-xs font-bold ${activeCategory === value ? 'bg-cobalt text-white' : 'border border-graphite/10 text-graphite hover:border-gold'}`}>{label}</button>
          ))}
        </div>
        <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 shrink-0 rounded-full border border-graphite/10 bg-offwhite px-3 text-xs font-bold">
          <option value="featured">Sort by: Featured</option>
          <option value="price">Price: Low-High</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {(activeFilterCount > 0 || (search && category)) && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {filters.warehouses.map((value) => (
            <button key={value} onClick={() => setFilters({...filters, warehouses:filters.warehouses.filter((item) => item !== value)})} className="flex h-8 items-center gap-1.5 rounded-full bg-graphite px-3 text-[11px] font-bold text-white">{value}<X size={12} /></button>
          ))}
          {filters.brands.map((value) => (
            <button key={value} onClick={() => setFilters({...filters, brands:filters.brands.filter((item) => item !== value)})} className="flex h-8 items-center gap-1.5 rounded-full bg-graphite px-3 text-[11px] font-bold text-white">{value}<X size={12} /></button>
          ))}
          {filters.maxPrice < 2500 && <button onClick={() => setFilters({...filters,maxPrice:2500})} className="flex h-8 items-center gap-1.5 rounded-full bg-graphite px-3 text-[11px] font-bold text-white">Under ${filters.maxPrice}<X size={12} /></button>}
          {filters.minRating > 0 && <button onClick={() => setFilters({...filters,minRating:0})} className="flex h-8 items-center gap-1.5 rounded-full bg-graphite px-3 text-[11px] font-bold text-white">{filters.minRating}+ stars<X size={12} /></button>}
          {filters.expressOnly && <button onClick={() => setFilters({...filters,expressOnly:false})} className="flex h-8 items-center gap-1.5 rounded-full bg-graphite px-3 text-[11px] font-bold text-white">Express eligible<X size={12} /></button>}
          {activeFilterCount > 0 && <button onClick={clearAll} className="text-xs font-black text-cobalt underline underline-offset-4">Clear All</button>}
        </div>
      )}

      {search && !products.length ? (
        <div className="rounded-[24px] border border-graphite/[.08] bg-white px-5 py-16 text-center">
          <p className="font-black">No matching hardware found for "{params.get('search')}"</p>
          <button onClick={() => {clearAll(); navigate('/products')}} className="mt-5 h-12 rounded-full bg-cobalt px-5 text-sm font-black text-white">Reset Search & Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} onQuickView={setQuick} />)}
        </div>
      )}

      <FilterDrawer open={drawerOpen} filters={filters} onChange={setFilters} onClose={() => setDrawerOpen(false)} onClear={clearAll} />
      <QuickViewModal product={quick} onClose={() => setQuick(null)} />
    </main>
  )
}
