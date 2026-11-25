import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { mockCatalog } from '../data/mockCatalog'
import WarehouseSplitGroup from '../components/WarehouseSplitGroup'
import SavedForLaterShelf from '../components/SavedForLaterShelf'
import PromoCodeDrawerInput from '../components/PromoCodeDrawerInput'
import GlobalOrderSummaryCard from '../components/GlobalOrderSummaryCard'
import SmartCrossSellCarousel from '../components/SmartCrossSellCarousel'
import FreeShippingProgressBar from '../components/FreeShippingProgressBar'
import type { Warehouse } from '../types'

export default function CartPage(){
 const {cartItems,savedItems}=useGlobalCartStore()
 const subtotal=cartItems.reduce((sum,item)=>{
  const product=mockCatalog.find((entry)=>entry.id===item.productId)
  return sum+(item.configuredPrice ?? product?.basePriceUSD ?? product?.price ?? 0)*item.quantity
 },0)
 if(!cartItems.length)return <main className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-12 text-center sm:px-6"><div className="rounded-[28px] border border-graphite/[.08] bg-white px-5 py-16"><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Global cart</p><h1 className="mt-2 text-3xl font-black">Your cart is empty</h1><p className="mt-2 text-sm text-graphite/55">Explore premium hardware across all fulfillment hubs.</p><Link to="/products" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-cobalt px-6 text-sm font-black text-white">Browse products <ArrowRight size={16}/></Link></div></main>
 return <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6"><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Secure cart</p><h1 className="mt-1 text-3xl font-black">Your global cart</h1><div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="min-w-0"><FreeShippingProgressBar subtotal={subtotal}/><div className="mt-4 space-y-4">{(['North America Hub','EU Central Hub','Asia-Pacific Hub'] as Warehouse[]).map(w=>{const items=cartItems.filter(i=>mockCatalog.find(p=>p.id===i.productId)?.warehouse===w);return items.length?<WarehouseSplitGroup key={w} warehouse={w} items={items} catalog={mockCatalog}/>:null})}</div><div className="mt-4"><PromoCodeDrawerInput/></div><SavedForLaterShelf items={savedItems} catalog={mockCatalog}/><SmartCrossSellCarousel/></div><GlobalOrderSummaryCard subtotal={subtotal}/></div></main>
}
