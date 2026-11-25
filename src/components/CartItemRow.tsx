import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem, Product } from '../types'
import { formatCurrency } from '../lib/commerce'
import { useGlobalCartStore } from '../store/useGlobalCartStore'

export default function CartItemRow({item,product}:{item:CartItem;product:Product}) {
  const {selectedCurrency,updateQuantity,removeFromCart,saveForLater}=useGlobalCartStore()
  const atMax=item.quantity>=product.maxStock
  return (
    <div className="flex gap-3 border-b border-graphite/[.08] py-4 last:border-0">
      <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"/>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-wider text-graphite/45">{product.brand}</p>
        <h3 className="truncate text-sm font-bold">{product.name}</h3>
        <p className="mt-1 text-xs text-graphite/50">{item.variant || product.specs[0]} · {item.warranty}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex h-9 items-center rounded-full border border-graphite/10 bg-white">
            <button aria-label="Decrease quantity" onClick={()=>updateQuantity(product.id,item.quantity-1,item.variant)} className="grid h-full w-9 place-items-center"><Minus size={13}/></button>
            <span className="w-7 text-center text-xs font-black">{item.quantity}</span>
            <button title={atMax?'Maximum stock reached':undefined} disabled={atMax} aria-label="Increase quantity" onClick={()=>updateQuantity(product.id,item.quantity+1,item.variant)} className="grid h-full w-9 place-items-center disabled:opacity-30"><Plus size={13}/></button>
          </div>
          <p className="text-sm font-black">{formatCurrency((item.configuredPrice??product.basePriceUSD??product.price)*item.quantity,selectedCurrency)}</p>
        </div>
        <div className="mt-2 flex gap-4 text-[11px] font-bold text-graphite/55">
          <button onClick={()=>saveForLater(product.id,item.variant)}>Save for later</button>
          <button onClick={()=>removeFromCart(product.id,item.variant)} className="flex items-center gap-1 text-coral"><Trash2 size={12}/>Remove</button>
        </div>
      </div>
    </div>
  )
}
