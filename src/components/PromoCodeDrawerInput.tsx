import { useState } from 'react'
import { Check, ChevronDown, Tag } from 'lucide-react'
import { useGlobalCartStore } from '../store/useGlobalCartStore'

export default function PromoCodeDrawerInput() {
  const [open,setOpen]=useState(false)
  const [code,setCode]=useState('')
  const [message,setMessage]=useState('')
  const {appliedCoupon,setCoupon}=useGlobalCartStore()
  const apply=(value:string)=>{
    const normalized=value.trim().toUpperCase()
    if(['GOLD15','GLOBALFREE','VANTRO20'].includes(normalized)){setCoupon(normalized);setCode(normalized);setMessage(normalized==='GLOBALFREE'?'Free shipping unlocked':'Promo applied')}
    else {setCoupon(null);setMessage('Code is not valid')}
  }
  return (
    <div className="rounded-2xl border border-graphite/[.08] bg-white p-4">
      <button onClick={()=>setOpen(!open)} className="flex w-full items-center justify-between text-sm font-bold"><span className="flex items-center gap-2"><Tag size={16} className="text-cobalt"/>Promo code</span><ChevronDown size={16} className={open?'rotate-180':''}/></button>
      {open&&<div className="mt-3"><div className="flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter code" className="h-11 min-w-0 flex-1 rounded-xl border border-graphite/10 px-3 text-sm"/><button onClick={()=>apply(code)} className="h-11 rounded-xl bg-cobalt px-4 text-xs font-black text-white">Apply Coupon</button></div>{appliedCoupon&&<p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald"><Check size={13}/>{appliedCoupon} active</p>}<p className="mt-2 text-xs text-graphite/55">{message||'Try GOLD15 or VANTRO20'}</p><div className="mt-3 flex flex-wrap gap-2">{['GOLD15','GLOBALFREE','VANTRO20'].map(v=><button key={v} onClick={()=>apply(v)} className="rounded-full border border-graphite/10 px-3 py-1.5 text-[10px] font-black hover:border-cobalt">{v}</button>)}</div></div>}
    </div>
  )
}
