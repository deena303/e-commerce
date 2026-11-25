import { ShoppingBag } from 'lucide-react'
import type { CartItem, Product } from '../types'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { formatCurrency } from '../lib/commerce'

export default function SavedForLaterShelf({items,catalog}:{items:CartItem[];catalog:Product[]}) {
  const {moveToCart,removeFromCart,selectedCurrency}=useGlobalCartStore()
  if(!items.length)return null
  return (
    <section className="mt-8"><h2 className="text-lg font-black">Saved for later <span className="text-graphite/40">({items.length})</span></h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=>{const p=catalog.find(v=>v.id===item.productId);if(!p)return null;return <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-graphite/[.08] bg-white p-3"><img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{p.name}</p><p className="mt-1 text-xs font-black">{formatCurrency(p.price,selectedCurrency)}</p><button onClick={()=>moveToCart(p.id)} className="mt-2 flex items-center gap-1 text-xs font-bold text-cobalt"><ShoppingBag size={13}/>Move to cart</button></div></div>})}</div></section>
  )
}
