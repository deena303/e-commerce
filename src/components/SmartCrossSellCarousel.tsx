import { Plus } from 'lucide-react'
import { mockCatalog } from '../data/mockCatalog'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { formatCurrency } from '../lib/commerce'

export default function SmartCrossSellCarousel() {
  const {cartItems,addToCart,selectedCurrency}=useGlobalCartStore()
  const suggestions=mockCatalog.filter(p=>!cartItems.some(i=>i.productId===p.id)).slice(-5)
  return (
    <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Complete the setup</p><h2 className="mt-1 text-xl font-black">Frequently bought together</h2></div></div><div className="scrollbar-hide flex gap-3 overflow-x-auto pb-3">{suggestions.map(p=><article key={p.id} className="w-44 shrink-0 overflow-hidden rounded-2xl border border-graphite/[.08] bg-white"><img src={p.image} alt={p.name} className="h-28 w-full object-cover"/><div className="p-3"><p className="truncate text-xs font-bold">{p.name}</p><div className="mt-2 flex items-center justify-between"><span className="text-xs font-black">{formatCurrency(p.price,selectedCurrency)}</span><button aria-label={`Add ${p.name}`} onClick={()=>addToCart(p.id)} className="grid h-8 w-8 place-items-center rounded-full bg-cobalt text-white"><Plus size={14}/></button></div></div></article>)}</div></section>
  )
}
