import { motion } from 'framer-motion'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { formatCurrency, taxRates } from '../lib/commerce'

export default function GlobalOrderSummaryCard({subtotal,compact=false}:{subtotal:number;compact?:boolean}) {
  const {selectedRegion,selectedCurrency,appliedCoupon,setCheckoutOpen}=useGlobalCartStore()
  const shipping=subtotal>500?0:35
  const duty=subtotal*.035
  const discount=appliedCoupon==='GOLD15'?subtotal*.15:appliedCoupon==='VANTRO20'?subtotal*.20:0
  const tax=(subtotal-discount+shipping+duty)*taxRates[selectedRegion]
  const total=subtotal-discount+shipping+duty+tax
  const row=(label:string,value:string,accent=false)=><div className="flex items-center justify-between gap-4 text-sm"><span className={accent?'font-bold':'text-white/60'}>{label}</span><motion.span key={value} initial={{y:4,opacity:0}} animate={{y:0,opacity:1}} className="font-black">{value}</motion.span></div>
  return (
    <aside className={`h-fit rounded-[24px] bg-graphite p-5 text-white shadow-premium ${compact?'':'sticky top-24'}`}>
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-gold">Global order summary</p>
      <div className="mt-5 space-y-3">{row('Subtotal',formatCurrency(subtotal,selectedCurrency))}{row('Multi-warehouse shipping',formatCurrency(shipping,selectedCurrency),shipping===0)}{row('Import duties / VAT',formatCurrency(duty+tax,selectedCurrency))}{discount>0&&row('Discount',`-${formatCurrency(discount,selectedCurrency)}`)}</div>
      <div className="my-5 h-px bg-white/10"/>
      <div className="flex items-end justify-between"><span className="text-sm text-white/65">Grand total</span><motion.p key={total} initial={{scale:.96,opacity:.5}} animate={{scale:1,opacity:1}} className="text-2xl font-black">{formatCurrency(total,selectedCurrency)}</motion.p></div>
      <button onClick={()=>setCheckoutOpen(true)} disabled={!subtotal} className="cobalt-sheen mt-5 h-12 w-full rounded-full bg-cobalt text-sm font-black text-white disabled:opacity-40">Proceed to Checkout</button>
      <p className="mt-3 text-center text-[10px] text-white/45">{selectedRegion} · Duties calculated at checkout</p>
    </aside>
  )
}
