import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { mockCatalog } from '../data/mockCatalog'
import PredictiveSearchBar from '../components/PredictiveSearchBar'
import { formatCurrency } from '../lib/commerce'
import { useGlobalCartStore } from '../store/useGlobalCartStore'

export default function NotFoundPage() {
  const currency = useGlobalCartStore((state) => state.selectedCurrency)
  return (
    <main className="relative min-h-[78vh] overflow-hidden bg-offwhite px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-[.08]" style={{backgroundImage:'linear-gradient(#1E1F24 1px, transparent 1px), linear-gradient(90deg,#1E1F24 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
      <div className="relative mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[28px] border border-gold/30 bg-graphite px-5 py-8 text-white sm:px-10 sm:py-10">
          <div className="flex flex-col items-start lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-gold/30 bg-elevated px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-gold">MODULE NOT FOUND // ROUTE_ERR_404</span>
              <p className="mt-6 text-[clamp(7rem,18vw,14rem)] font-black leading-[.72] tracking-[-.09em] text-gold">404</p>
            </div>
            <div className="mt-8 max-w-lg lg:mt-0">
              <h1 className="text-2xl font-black sm:text-3xl">This route lost its signal.</h1>
              <p className="mt-3 text-sm leading-6 text-white/60">The hardware SKU or page you're looking for doesn't exist in our global inventory.</p>
            </div>
          </div>

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <PredictiveSearchBar compact />
              <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-graphite/35" size={17}/>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="flex h-12 items-center justify-center gap-2 rounded-full bg-cobalt px-6 text-sm font-black text-white"><ArrowLeft size={16}/>Back to Storefront</Link>
            <Link to="/products" className="flex h-12 items-center justify-center rounded-full border border-gold/70 px-6 text-sm font-black text-gold hover:bg-gold hover:text-graphite">Browse Global Catalog</Link>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Alternative modules</p>
              <h2 className="mt-1 text-xl font-black">Featured hardware</h2>
            </div>
            <Link to="/products" className="text-xs font-black text-cobalt">View catalog</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {mockCatalog.slice(0,3).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="flex items-center gap-3 rounded-2xl border border-graphite/[.08] bg-white p-3 transition hover:-translate-y-1 hover:border-gold">
                <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover"/>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-graphite/45">{product.brand}</p>
                  <p className="truncate text-sm font-bold">{product.name}</p>
                  <p className="mt-1 text-xs font-black text-cobalt">{formatCurrency(product.price,currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
