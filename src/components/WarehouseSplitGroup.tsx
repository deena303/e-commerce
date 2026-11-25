import { PackageCheck } from 'lucide-react'
import type { CartItem, Product, Warehouse } from '../types'
import CartItemRow from './CartItemRow'

export default function WarehouseSplitGroup({warehouse,items,catalog}:{warehouse:Warehouse;items:CartItem[];catalog:Product[]}) {
  const day=warehouse==='North America Hub'?'2-4':warehouse==='EU Central Hub'?'3-5':'5-8'
  return (
    <section className="overflow-hidden rounded-2xl border border-graphite/[.08] bg-white">
      <header className="flex items-center justify-between bg-graphite px-4 py-3 text-white"><div className="flex items-center gap-2"><PackageCheck size={16} className="text-gold"/><p className="text-xs font-black uppercase tracking-wider">{warehouse}</p></div><p className="text-[10px] text-white/60">{day} business days</p></header>
      <div className="px-4">{items.map(item=>{const product=catalog.find(p=>p.id===item.productId);return product?<CartItemRow key={`${item.productId}:${item.variant??''}`} item={item} product={product}/>:null})}</div>
    </section>
  )
}
