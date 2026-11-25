import { useEffect } from 'react'
import { AnimatePresence,motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, X } from 'lucide-react'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { mockCatalog } from '../data/mockCatalog'
import CartItemRow from './CartItemRow'
import FreeShippingProgressBar from './FreeShippingProgressBar'
import { formatCurrency } from '../lib/commerce'
import { useNavigate } from 'react-router-dom'

export default function SlideOverCartDrawer({onCartPage}:{onCartPage:()=>void}) {
  const navigate=useNavigate()
  const {cartOpen,setCartOpen,cartItems,setCheckoutOpen,selectedCurrency}=useGlobalCartStore()
  useEffect(() => {
    const key=(e:KeyboardEvent)=>{ if(e.key==='Escape') setCartOpen(false) }
    window.addEventListener('keydown',key)
    return () => window.removeEventListener('keydown',key)
  },[setCartOpen])
  const subtotal=cartItems.reduce((sum,i)=>sum+(mockCatalog.find(p=>p.id===i.productId)?.price||0)*i.quantity,0)
  return (
    <AnimatePresence>{cartOpen&&<>
      <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} aria-label="Close cart" onClick={()=>setCartOpen(false)} className="fixed inset-0 z-[60] bg-graphite/55 backdrop-blur-[2px]"/>
      <motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:300}} role="dialog" aria-modal="true" aria-label="Global cart"
        className="fixed bottom-0 right-0 top-0 z-[61] flex w-full max-w-md flex-col bg-graphite text-white shadow-premium">
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-5"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-gold">Your selection</p><h2 className="mt-1 text-xl font-black">Global Cart <span className="text-white/40">({cartItems.length})</span></h2></div><button aria-label="Close cart" onClick={()=>setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10"><X size={18}/></button></header>
        {cartItems.length?<><div className="flex-1 overflow-y-auto px-5 text-graphite [&_.border-b]:border-white/10 [&_.bg-white]:bg-graphite [&_.bg-white]:text-white [&_.text-graphite\\/50]:text-white/50 [&_.text-graphite\\/55]:text-white/55 [&_.border-graphite\\/10]:border-white/10"><div className="pt-4"><FreeShippingProgressBar subtotal={subtotal}/></div>{cartItems.map(item=>{const p=mockCatalog.find(v=>v.id===item.productId);return p?<CartItemRow key={item.productId} item={item} product={p}/>:null})}</div><footer className="border-t border-white/10 p-5"><div className="mb-4 flex justify-between"><span className="text-sm text-white/60">Subtotal</span><b className="text-xl">{formatCurrency(subtotal,selectedCurrency)}</b></div><button onClick={()=>{setCartOpen(false);navigate('/checkout')}} className="cobalt-sheen flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cobalt text-sm font-black">Proceed to Checkout <ArrowRight size={16}/></button><button onClick={()=>{setCartOpen(false);navigate('/cart')}} className="mt-3 h-10 w-full text-xs font-bold text-gold">View full cart</button></footer></>:<div className="grid flex-1 place-items-center p-8 text-center"><div><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-elevated"><ShoppingBag size={26} className="text-gold"/></div><h3 className="mt-5 text-xl font-black">Your cart is ready for ideas</h3><p className="mt-2 text-sm text-white/55">Explore curated global hardware and add your first component.</p></div></div>}
      </motion.aside>
    </>}</AnimatePresence>
  )
}
