import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Product } from '../types'
import { formatCurrency } from '../lib/commerce'
import { useGlobalCartStore } from '../store/useGlobalCartStore'

export default function QuickViewModal({product,onClose}:{product:Product|null;onClose:()=>void}) {
  const [warranty,setWarranty]=useState<'Standard'|'2-Year'|'3-Year'>('Standard')
  const {selectedCurrency,addToCart}=useGlobalCartStore()
  useEffect(() => {
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose() }
    window.addEventListener('keydown',onKey)
    return () => window.removeEventListener('keydown',onKey)
  },[onClose])
  if(!product)return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6">
      <button aria-label="Close quick view" onClick={onClose} className="absolute inset-0 bg-graphite/70 backdrop-blur-sm"/>
      <div role="dialog" aria-modal="true" aria-label={`Quick view ${product.name}`} className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white lg:grid-cols-2">
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow-md"><X size={18}/></button>
        <img src={product.image} alt={product.name} className="h-72 w-full object-cover lg:h-full"/>
        <div className="p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.16em] text-cobalt">{product.brand}</p><h2 className="mt-2 text-3xl font-black tracking-tight">{product.name}</h2>
          <p className="mt-3 text-2xl font-black">{formatCurrency(product.price,selectedCurrency)}</p>
          <div className="mt-6 space-y-2">{product.specs.map(s=><p key={s} className="flex items-center gap-2 text-sm"><Check size={15} className="text-emerald"/>{s}</p>)}</div>
          <p className="mt-6 text-xs font-black uppercase tracking-wider">Warranty</p>
          <div className="mt-2 grid grid-cols-3 gap-2">{(['Standard','2-Year','3-Year'] as const).map(v=><button key={v} onClick={()=>setWarranty(v)} className={`rounded-xl border px-2 py-3 text-xs font-bold ${warranty===v?'border-cobalt bg-cobalt text-white':'border-graphite/10'}`}>{v}</button>)}</div>
          <button onClick={()=>{addToCart(product.id);onClose()}} className="cobalt-sheen mt-6 h-12 w-full rounded-full bg-cobalt text-sm font-black text-white">Add to Global Cart</button>
        </div>
      </div>
    </div>
  )
}
