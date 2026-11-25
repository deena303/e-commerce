import { useState } from 'react'
import { ChevronDown, Globe2 } from 'lucide-react'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { currencyByRegion, regionNames } from '../lib/commerce'
import type { RegionCode } from '../types'

export default function RegionCurrencySwitcher() {
  const [open, setOpen] = useState(false)
  const { selectedRegion, selectedCurrency, setRegionCurrency } = useGlobalCartStore()
  const choose = (region: RegionCode) => {
    setRegionCurrency(region, currencyByRegion[region])
    setOpen(false)
  }
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="dialog" aria-expanded={open}
        className="flex h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-xs font-bold text-white transition hover:border-gold/60">
        <Globe2 size={15} className="text-gold" /><span className="hidden sm:inline">{regionNames[selectedRegion]}</span><span>{selectedCurrency}</span><ChevronDown size={13}/>
      </button>
      {open && (
        <div role="dialog" aria-label="Region and currency" className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-graphite p-2 shadow-premium">
          {(Object.keys(regionNames) as RegionCode[]).map((region) => (
            <button key={region} onClick={() => choose(region)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm text-white transition ${selectedRegion === region ? 'bg-cobalt' : 'hover:bg-elevated'}`}>
              <span>{regionNames[region]}</span><span className="text-xs opacity-70">{currencyByRegion[region]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
