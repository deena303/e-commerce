import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftRight, ChevronDown, Heart, HelpCircle, Menu, Search, ShoppingCart, Truck, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PredictiveSearchBar from './PredictiveSearchBar'
import RegionCurrencySwitcher from './RegionCurrencySwitcher'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { mockCatalog } from '../data/mockCatalog'
import { formatCurrency } from '../lib/commerce'

const categories = [
  ['PC & GPU','gpus','Custom PCs & GPUs'],
  ['Audio & Peripherals','audio','Audio & Peripherals'],
  ['Smart Displays','displays','Smart Displays'],
  ['Modular Power','power','Modular Power'],
  ['Mobile & Smart Devices','mobile','Mobile & Smart Devices']
] as const

export default function GlobalMegaNavbar() {
  const [mobileOpen,setMobileOpen]=useState(false)
  const [allCategoriesOpen,setAllCategoriesOpen]=useState(false)
  const [utilityOpen,setUtilityOpen]=useState<'help'|'track'|'duty'|null>(null)
  const [compareOpen,setCompareOpen]=useState(false)
  const [searchCategory,setSearchCategory]=useState('All')
  const navigate=useNavigate()
  const location=useLocation()
  const {cartItems,savedItems,setCartOpen,selectedCurrency}=useGlobalCartStore()
  const count=cartItems.reduce((sum,item)=>sum+item.quantity,0)
  const subtotal=cartItems.reduce((sum,item)=>{
    const product=mockCatalog.find((entry)=>entry.id===item.productId)
    return sum+(item.configuredPrice ?? product?.basePriceUSD ?? product?.price ?? 0)*item.quantity
  },0)

  const nav=(label:string,to:string)=>{
    const active=to==='/'?location.pathname==='/' : location.pathname.startsWith(to)
    return <Link to={to} className={`whitespace-nowrap border-b-2 text-sm font-semibold leading-none py-3.5 transition-colors ${active?'border-cobalt text-graphite':'border-transparent text-graphite/80 hover:text-graphite'}`}>{label}</Link>
  }

  return (
    <>
      <header className="sticky top-0 z-40 shadow-premium">
        <div className="hidden border-b border-elevated/80 bg-graphite text-white xl:block">
          <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-6 text-[11px]">
            <div className="flex items-center gap-5">
              <button onClick={()=>setUtilityOpen('help')} className="flex items-center gap-1.5 font-bold text-white/70 hover:text-gold"><HelpCircle size={12}/>Help</button>
              <button onClick={()=>setUtilityOpen('track')} className="flex items-center gap-1.5 font-bold text-white/70 hover:text-gold"><Truck size={12}/>Track Order</button>
              <button onClick={()=>setUtilityOpen('duty')} className="font-bold text-white/70 hover:text-gold">Global Duty Calculator</button>
            </div>
            <p className="font-black tracking-[.12em] text-gold">FREE GLOBAL AIR OVER $500 <span className="mx-2 text-white/30">•</span> FLASH: 15% OFF MODULAR POWER WITH GOLD15</p>
            <div className="flex items-center gap-3">
              <RegionCurrencySwitcher/>
              <select aria-label="Language" className="h-7 rounded bg-elevated px-2 text-[11px] font-bold text-white"><option>EN</option><option>ES</option><option>JP</option></select>
              <Link to="/cart" className="font-bold text-white/70 hover:text-gold">My Account / Orders</Link>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 bg-graphite text-white">
          <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-3 px-4 sm:px-6">
            <button onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Open category menu" className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-elevated lg:hidden">
              {mobileOpen?<X size={20}/>:<Menu size={20}/>}
            </button>
            <Link to="/" aria-label="Go to storefront" className="shrink-0 rounded-lg bg-gold px-3 py-2.5 text-sm font-black tracking-tight text-graphite">MODU<span className="text-cobalt">/</span>LO</Link>

            <div className="mx-2 hidden min-w-0 flex-1 items-stretch md:flex md:max-w-3xl">
              <div className="relative flex min-w-0 flex-1 items-stretch rounded-l-full bg-white">
                <PredictiveSearchBar compact/>
                <div className="my-2 w-px bg-graphite/10"/>
                <select value={searchCategory} onChange={(event)=>setSearchCategory(event.target.value)} aria-label="Search category" className="h-11 w-[118px] rounded-r-none bg-white px-2 text-xs font-bold text-graphite outline-none">
                  {['All','PC & GPU','Audio','Displays','Power','Mobile'].map((category)=><option key={category}>{category}</option>)}
                </select>
              </div>
              <button onClick={()=>{
                const mapping:Record<string,string>={All:'all', 'PC & GPU':'gpus',Audio:'audio',Displays:'displays',Power:'power',Mobile:'mobile'}
                if(searchCategory==='All') navigate('/products')
                else navigate(`/products?category=${mapping[searchCategory]}`)
              }} aria-label="Submit search" className="grid h-11 w-12 shrink-0 place-items-center rounded-r-full bg-gold text-graphite"><Search size={18}/></button>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button onClick={()=>setCompareOpen(true)} aria-label="Open compare specs" className="relative hidden h-11 w-11 place-items-center rounded-full bg-elevated transition hover:border hover:border-gold sm:grid"><ArrowLeftRight size={18}/><span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-black text-graphite">0</span></button>
              <button onClick={()=>navigate('/cart')} aria-label={`Open saved items, ${savedItems.length} items`} className="relative hidden h-11 w-11 place-items-center rounded-full bg-elevated transition hover:border hover:border-gold sm:grid"><Heart size={18}/><span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-black text-graphite">{savedItems.length}</span></button>
              <button onClick={()=>setCartOpen(true)} aria-label={`Open cart with ${count} items`} className="flex h-11 items-center gap-2 rounded-full bg-elevated pl-3 pr-2 transition hover:border hover:border-gold">
                <span className="relative grid h-8 w-8 place-items-center"><ShoppingCart size={20}/><span className="absolute -right-1 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-cobalt px-1 text-[10px] font-black">{count}</span></span>
                <motion.span key={subtotal} initial={{opacity:.5,y:3}} animate={{opacity:1,y:0}} className="hidden text-xs font-black lg:block">{formatCurrency(subtotal,selectedCurrency)}</motion.span>
              </button>
            </div>
          </div>

          <div className="px-4 pb-3 md:hidden"><PredictiveSearchBar compact/></div>
          {mobileOpen&&<div className="border-t border-white/10 px-4 py-3 lg:hidden">{categories.map(([label,param])=><button key={param} onClick={()=>{navigate(`/products?category=${param}`);setMobileOpen(false)}} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-bold hover:bg-elevated">{label}</button>)}</div>}
        </div>

        <div className="relative bg-gold text-graphite">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <button onClick={()=>setAllCategoriesOpen(!allCategoriesOpen)} aria-expanded={allCategoriesOpen} className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-graphite px-4 py-1.5 text-sm font-semibold text-white"><Menu size={14}/>All Categories <ChevronDown size={13}/></button>
              {allCategoriesOpen&&<div className="absolute left-0 top-10 z-50 w-64 rounded-2xl border border-graphite/10 bg-white p-2 shadow-premium">{categories.map(([label,param])=><button key={param} onClick={()=>{navigate(`/products?category=${param}`);setAllCategoriesOpen(false)}} className="flex w-full rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-offwhite">{label}</button>)}<button onClick={()=>navigate('/products')} className="mt-1 w-full rounded-xl bg-graphite px-3 py-3 text-left text-sm font-bold text-gold">Global Warehouse Deals</button></div>}
            </div>
            <nav className="hidden h-full items-center gap-6 md:flex">
              {nav('Home','/')}
              {nav('Shop All','/products')}
              <button onClick={()=>navigate('/products?category=power')} className="whitespace-nowrap border-b-2 border-transparent py-3.5 text-sm font-semibold leading-none text-graphite/80 transition-colors hover:text-graphite">Flash Deals</button>
              {nav('Track Shipment','/cart')}
              {nav('Cart','/cart')}
            </nav>
            </div>
            <button onClick={()=>setUtilityOpen('help')} className="hidden shrink-0 whitespace-nowrap rounded-full bg-cobalt px-4 py-1.5 text-xs font-bold text-white sm:flex">24/7 Tech Support</button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {(utilityOpen||compareOpen)&&<div className="fixed inset-0 z-[90] grid place-items-center p-4">
          <motion.button aria-label="Close dialog" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>{setUtilityOpen(null);setCompareOpen(false)}} className="absolute inset-0 bg-graphite/60 backdrop-blur-sm"/>
          <motion.div role="dialog" aria-modal="true" initial={{scale:.96,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.96,opacity:0}} className="relative w-full max-w-md rounded-[24px] bg-white p-6 shadow-premium">
            <button onClick={()=>{setUtilityOpen(null);setCompareOpen(false)}} aria-label="Close dialog" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-graphite/10"><X size={16}/></button>
            {utilityOpen&&<><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">{utilityOpen==='help'?'Customer support':utilityOpen==='track'?'Shipment tracker':'Duty estimator'}</p><h2 className="mt-2 pr-10 text-2xl font-black">{utilityOpen==='help'?'How can we help?':utilityOpen==='track'?'Track your global order':'Estimate import duties'}</h2><p className="mt-3 text-sm leading-6 text-graphite/60">{utilityOpen==='help'?'Our technical team is available around the clock for configuration and compatibility questions.':utilityOpen==='track'?'Enter a tracking ID or open your account orders to view live shipment milestones.':'Regional VAT and import estimates are calculated automatically at checkout using your delivery region.'}</p><button onClick={()=>{setUtilityOpen(null);navigate(utilityOpen==='track'?'/cart':'/checkout')}} className="mt-5 h-11 w-full rounded-full bg-cobalt text-sm font-black text-white">{utilityOpen==='track'?'View my orders':'Continue'}</button></>}
            {compareOpen&&<><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Specification lab</p><h2 className="mt-2 text-2xl font-black">Compare specs</h2><p className="mt-3 text-sm text-graphite/55">No products are selected for comparison yet.</p><button onClick={()=>{setCompareOpen(false);navigate('/products')}} className="mt-5 h-11 w-full rounded-full bg-cobalt text-sm font-black text-white">Browse products</button></>}
          </motion.div>
        </div>}
      </AnimatePresence>
    </>
  )
}
