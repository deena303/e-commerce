import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, X } from 'lucide-react'

export interface CatalogFilters {
  warehouses: string[]
  brands: string[]
  maxPrice: number
  minRating: number
  expressOnly: boolean
}

interface Props {
  open: boolean
  filters: CatalogFilters
  onChange: (filters: CatalogFilters) => void
  onClose: () => void
  onClear: () => void
}

export default function FilterDrawer({ open, filters, onChange, onClose, onClear }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const toggle = (field: 'warehouses' | 'brands', value: string) => {
    const current = filters[field]
    onChange({
      ...filters,
      [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.button
            aria-label="Close filter drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-graphite/55 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Catalog filters"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="absolute bottom-0 left-0 top-0 w-[88%] max-w-sm overflow-y-auto bg-offwhite p-5 shadow-premium"
          >
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Refine catalog</p>
                <h2 className="mt-1 text-xl font-black">Filters</h2>
              </div>
              <button onClick={onClose} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-full border border-graphite/10 bg-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-7">
              <section>
                <p className="mb-3 text-xs font-black uppercase tracking-[.16em]">Warehouse Origin</p>
                {['North America','EU Central','Asia-Pacific'].map((value) => (
                  <label key={value} className="mb-3 flex items-center gap-3 text-sm">
                    <input type="checkbox" checked={filters.warehouses.includes(value)} onChange={() => toggle('warehouses', value)} className="h-4 w-4 accent-cobalt" />
                    {value}
                  </label>
                ))}
              </section>

              <section>
                <div className="mb-3 flex justify-between text-xs font-black uppercase tracking-[.16em]">
                  <span>Maximum Price</span><span className="text-cobalt">${filters.maxPrice.toLocaleString()}</span>
                </div>
                <input type="range" min="100" max="2500" step="50" value={filters.maxPrice} onChange={(event) => onChange({...filters, maxPrice: Number(event.target.value)})} className="range w-full" />
                <div className="mt-2 flex justify-between text-xs text-graphite/45"><span>$100</span><span>$2,500</span></div>
              </section>

              <section>
                <p className="mb-3 text-xs font-black uppercase tracking-[.16em]">Brand</p>
                {['NOVA','FORGE','AETHER','VECTOR','SONICARC','KEYFORM','AXIS','PULSE','VISTA','FRAME','HUB','NEXUS','GRIDCORE','VOLT','RESERVE','RAIDON'].map((value) => (
                  <label key={value} className="mb-3 flex items-center gap-3 text-sm">
                    <input type="checkbox" checked={filters.brands.includes(value)} onChange={() => toggle('brands', value)} className="h-4 w-4 accent-cobalt" />
                    {value}
                  </label>
                ))}
              </section>

              <section>
                <p className="mb-3 text-xs font-black uppercase tracking-[.16em]">Minimum Rating</p>
                {[0,5,4,3].map((value) => (
                  <label key={value} className="mb-3 flex items-center gap-3 text-sm">
                    <input type="radio" name="rating" checked={filters.minRating === value} onChange={() => onChange({...filters, minRating:value})} className="accent-cobalt" />
                    {value === 0 ? 'All ratings' : `${value}+ stars`}
                  </label>
                ))}
              </section>

              <label className="flex items-center justify-between rounded-xl border border-graphite/10 bg-white p-3 text-sm font-bold">
                <span>Express eligible</span>
                <input type="checkbox" checked={filters.expressOnly} onChange={(event) => onChange({...filters, expressOnly:event.target.checked})} className="h-5 w-9 accent-cobalt" />
              </label>
            </div>

            <div className="sticky bottom-0 mt-8 grid grid-cols-[44px_1fr] gap-2 bg-offwhite pt-3">
              <button onClick={onClear} aria-label="Clear all filters" className="grid h-12 place-items-center rounded-full border border-graphite/10 bg-white"><RotateCcw size={17} /></button>
              <button onClick={onClose} className="h-12 rounded-full bg-cobalt text-sm font-black text-white">Show results</button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
