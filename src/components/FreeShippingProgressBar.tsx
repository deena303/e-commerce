import { Truck } from 'lucide-react'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { formatCurrency } from '../lib/commerce'

export default function FreeShippingProgressBar({subtotal}:{subtotal:number}) {
  const currency=useGlobalCartStore(s=>s.selectedCurrency)
  const percent=Math.min(100,subtotal/500*100)
  const remaining=Math.max(0,500-subtotal)
  return (
    <div className="rounded-2xl border border-cobalt/15 bg-cobalt/[.04] p-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 font-bold"><Truck size={15} className="text-cobalt"/>Global air shipping</span><span className="text-graphite/55">{remaining?`${formatCurrency(remaining,currency)} to go`:'Unlocked'}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-graphite/10"><div className="h-full rounded-full bg-cobalt transition-all duration-500" style={{width:`${percent}%`}}/></div>
    </div>
  )
}
