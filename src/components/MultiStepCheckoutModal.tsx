import { useEffect,useState } from 'react'
import { Check, ChevronLeft, LoaderCircle, LockKeyhole, X } from 'lucide-react'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { mockCatalog } from '../data/mockCatalog'
import { formatCurrency } from '../lib/commerce'

export default function MultiStepCheckoutModal() {
  const {checkoutOpen,setCheckoutOpen,cartItems,selectedRegion,selectedCurrency,selectedShippingMethods,setShippingMethod,removeFromCart}=useGlobalCartStore()
  const [step,setStep]=useState(1),[loading,setLoading]=useState(false),[complete,setComplete]=useState(false),[tracking,setTracking]=useState('')
  useEffect(() => {
    const key=(e:KeyboardEvent)=>{ if(e.key==='Escape') setCheckoutOpen(false) }
    window.addEventListener('keydown',key)
    return () => window.removeEventListener('keydown',key)
  },[setCheckoutOpen])
  useEffect(()=>{if(!checkoutOpen){setStep(1);setComplete(false)}},[checkoutOpen])
  if(!checkoutOpen)return null
  const subtotal=cartItems.reduce((sum,i)=>sum+(mockCatalog.find(p=>p.id===i.productId)?.price||0)*i.quantity,0)
  const confirm=()=>{setLoading(true);setTimeout(()=>{setLoading(false);setComplete(true);setTracking(`GLB-${Math.random().toString(36).slice(2,8).toUpperCase()}`);cartItems.forEach(i=>removeFromCart(i.productId))},1400)}
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-3 sm:p-6"><button aria-label="Close checkout" onClick={()=>setCheckoutOpen(false)} className="absolute inset-0 bg-graphite/75 backdrop-blur-sm"/>
      <div role="dialog" aria-modal="true" aria-label="Global checkout" className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-offwhite shadow-premium">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-graphite/10 bg-offwhite px-5 py-4 sm:px-7"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Secure checkout</p><p className="mt-1 text-sm font-black">{complete?'Order confirmed':`Step ${step} of 3`}</p></div><button onClick={()=>setCheckoutOpen(false)} aria-label="Close checkout" className="grid h-9 w-9 place-items-center rounded-full border border-graphite/10"><X size={17}/></button></header>
        <div className="flex gap-2 px-5 pt-5 sm:px-7">{[1,2,3].map(n=><div key={n} className={`h-1.5 flex-1 rounded-full ${n<=step?'bg-cobalt':'bg-graphite/10'}`}/>)}</div>
        {complete?<div className="p-8 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald text-white"><Check size={28}/></div><h2 className="mt-5 text-3xl font-black">Your hardware is moving.</h2><p className="mx-auto mt-3 max-w-sm text-sm text-graphite/60">Confirmation and customs documents are ready in your account.</p><div className="mx-auto mt-6 max-w-xs rounded-2xl border border-graphite/10 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-graphite/45">Tracking ID</p><p className="mt-1 font-mono text-lg font-black text-cobalt">{tracking}</p></div><button onClick={()=>setCheckoutOpen(false)} className="mt-6 h-11 rounded-full bg-graphite px-6 text-sm font-black text-white">Continue shopping</button></div>:
        <div className="p-5 sm:p-7">
          {step===1&&<><h2 className="text-2xl font-black">Regional address</h2><p className="mt-1 text-sm text-graphite/55">Delivering to {selectedRegion}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><input aria-label="Full name" placeholder="Full name" className="h-12 rounded-xl border border-graphite/10 bg-white px-4 text-sm"/><input aria-label="Email" placeholder="Email address" type="email" className="h-12 rounded-xl border border-graphite/10 bg-white px-4 text-sm"/><input aria-label="Street address" placeholder="Street address" className="h-12 rounded-xl border border-graphite/10 bg-white px-4 text-sm sm:col-span-2"/><input aria-label="Postal code" placeholder="Postal / ZIP code" className="h-12 rounded-xl border border-graphite/10 bg-white px-4 text-sm"/><input aria-label="Customs ID" placeholder="Tax / customs ID" className="h-12 rounded-xl border border-graphite/10 bg-white px-4 text-sm"/></div></>}
          {step===2&&<><h2 className="text-2xl font-black">Shipping speed</h2><p className="mt-1 text-sm text-graphite/55">Choose per fulfillment warehouse</p><div className="mt-5 space-y-3">{['North America Hub','EU Central Hub','Asia-Pacific Hub'].map(warehouse=>{const typed=warehouse as keyof typeof selectedShippingMethods;return <div key={warehouse} className="rounded-2xl border border-graphite/10 bg-white p-4"><p className="text-sm font-bold">{warehouse}</p><div className="mt-3 grid grid-cols-2 gap-2">{(['standard','express'] as const).map(method=><button key={method} onClick={()=>setShippingMethod(typed,method)} className={`rounded-xl border p-3 text-left ${selectedShippingMethods[typed]===method?'border-cobalt bg-cobalt text-white':'border-graphite/10'}`}><b className="block text-xs capitalize">{method}</b><span className="mt-1 block text-[10px] opacity-70">{method==='express'?'1-3 days':'3-8 days'}</span></button>)}</div></div>})}</div></>}
          {step===3&&<><h2 className="text-2xl font-black">Payment & confirmation</h2><div className="mt-5 rounded-2xl border border-graphite/10 bg-white p-5"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold"><LockKeyhole size={16} className="text-cobalt"/>Card ending 4242</span><span className="text-xs font-bold">VISA</span></div><div className="mt-5 flex items-end justify-between border-t border-graphite/10 pt-4"><span className="text-sm text-graphite/55">Total due</span><b className="text-2xl">{formatCurrency(subtotal*(subtotal>500?1.035:1.1),selectedCurrency)}</b></div></div></>}
          <div className="mt-6 flex items-center justify-between">{step>1?<button onClick={()=>setStep(step-1)} className="flex h-11 items-center gap-2 px-2 text-sm font-bold"><ChevronLeft size={16}/>Back</button>:<span/>}<button disabled={loading} onClick={()=>step<3?setStep(step+1):confirm()} className="cobalt-sheen flex h-12 min-w-40 items-center justify-center rounded-full bg-cobalt px-6 text-sm font-black text-white">{loading?<LoaderCircle className="animate-spin" size={18}/>:step<3?'Continue':'Place Global Order'}</button></div>
        </div>}
      </div>
    </div>
  )
}
