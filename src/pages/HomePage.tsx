import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Clock3, Copy, Globe2, PackageCheck, ShieldCheck, SlidersHorizontal, Truck } from 'lucide-react'
import HeroShowcaseBanner from '../components/HeroShowcaseBanner'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import FilterDrawer, { type CatalogFilters } from '../components/FilterDrawer'
import { mockCatalog } from '../data/mockCatalog'
import type { Product } from '../types'

const defaultFilters: CatalogFilters = {
  warehouses: [],
  brands: [],
  maxPrice: 2500,
  minRating: 0,
  expressOnly: false
}

export default function HomePage() {
  const navigate = useNavigate()
  const [quick,setQuick]=useState<Product|null>(null)
  const [drawerOpen,setDrawerOpen]=useState(false)
  const [filters,setFilters]=useState<CatalogFilters>(defaultFilters)
  const [category,setCategory]=useState('all')
  const [copied,setCopied]=useState(false)

  const categories=[
    {label:'PC & GPU',param:'gpus',count:'24 Modules',image:'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=900&q=85'},
    {label:'Audio & Peripherals',param:'audio',count:'18 Modules',image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'},
    {label:'Smart Displays',param:'displays',count:'12 Modules',image:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85'},
    {label:'Modular Power',param:'power',count:'16 Modules',image:'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85'}
  ]

  const map:Record<string,string>={gpus:'Custom PCs & GPUs',audio:'Audio & Peripherals',displays:'Smart Displays',power:'Modular Power'}
  let trending=category==='all'?mockCatalog:mockCatalog.filter((product)=>product.category===map[category])
  trending=trending.filter((product)=>
    (!filters.warehouses.length||filters.warehouses.some((origin)=>product.warehouse.startsWith(origin.split(' ')[0]))) &&
    (!filters.brands.length||filters.brands.includes(product.brand)) &&
    product.price<=filters.maxPrice &&
    product.rating>=filters.minRating &&
    (!filters.expressOnly||product.expressEligible)
  ).slice(0,8)

  const activeFilterCount=filters.warehouses.length+filters.brands.length+(filters.maxPrice<2500?1:0)+(filters.minRating>0?1:0)+(filters.expressOnly?1:0)

  const copyCode=async()=>{
    try{await navigator.clipboard.writeText('GOLD15')}catch{}
    setCopied(true)
    window.setTimeout(()=>setCopied(false),1400)
  }

  return (
    <main className="mx-auto max-w-7xl space-y-14 px-4 pb-16 sm:px-6">
      <HeroShowcaseBanner/>

      <section className="grid grid-cols-2 gap-6 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm lg:grid-cols-4">
        {[
          {icon:Globe2,title:'3 Global Warehouses',text:'US, EU & APAC Direct Dispatch'},
          {icon:Clock3,title:'Live Customs & Duty Calc',text:'Zero Surprise Import Fees'},
          {icon:Truck,title:'Free Global Air',text:'On Orders Over $500'},
          {icon:ShieldCheck,title:'2-Year Hardware Warranty',text:'Instant Global Replacement'}
        ].map(({icon:Icon,title,text})=>(
          <div key={title} className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/20 text-graphite"><Icon size={20} className="text-graphite"/></span>
            <div><p className="text-sm font-black text-graphite">{title}</p><p className="mt-1 text-xs leading-5 text-graphite/55">{text}</p></div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Hardware departments</p><h2 className="mt-1 text-2xl font-black tracking-tight text-graphite">Shop by Hardware Category</h2></div>
          <Link to="/products" className="flex items-center gap-2 text-xs font-black text-cobalt">View All Categories <ArrowRight size={14}/></Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item)=>(
            <Link key={item.param} to={`/products?category=${item.param}`} className="group relative min-h-[280px] overflow-hidden rounded-3xl border border-transparent bg-graphite transition hover:border-cobalt">
              <img src={item.image} alt={item.label} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-[1.04]"/>
              <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/20 to-transparent"/>
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <p className="text-[10px] font-black uppercase tracking-[.16em] text-gold">{item.count}</p>
                <h3 className="mt-1 text-xl font-black">{item.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div><p className="text-[10px] font-black uppercase tracking-[.16em] text-cobalt">Fast-moving inventory</p><h2 className="mt-1 text-2xl font-black text-graphite">Trending Global Inventory</h2></div>
          <Link to="/products" className="hidden items-center gap-2 text-xs font-black text-cobalt sm:flex">View catalog <ArrowRight size={14}/></Link>
        </div>
        <div className="mb-5 flex items-center gap-2 overflow-x-auto">
          <button onClick={()=>setDrawerOpen(true)} className="relative flex h-10 shrink-0 items-center gap-2 rounded-full bg-graphite px-4 text-xs font-black text-white"><SlidersHorizontal size={15} className="text-gold"/>Filters{activeFilterCount>0&&<span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] text-graphite">{activeFilterCount}</span>}</button>
          {[['all','All'],['gpus','PC & GPU'],['audio','Audio'],['displays','Displays'],['power','Power']].map(([value,label])=>(
            <button key={value} onClick={()=>setCategory(value)} className={`h-10 shrink-0 rounded-full px-4 text-xs font-bold ${category===value?'bg-cobalt text-white':'border border-graphite/10 bg-white text-graphite'}`}>{label}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product)=><ProductCard key={product.id} product={product} onQuickView={setQuick}/>)}
        </div>
      </section>

      <section className="grid items-center gap-6 rounded-3xl border border-gold/20 bg-graphite p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.18em] text-gold">Limited modular bundle</p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">15% Off Modular Power & Cooling Bundles</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={copyCode} className="flex h-12 items-center gap-2 rounded-full border border-gold/50 px-5 text-sm font-black text-gold">{copied?<><Check size={16}/>Copied</>:<><Copy size={16}/>Copy Code GOLD15</>}</button>
          <button onClick={()=>navigate('/products?category=power')} className="h-12 rounded-full bg-cobalt px-6 text-sm font-black text-white transition hover:bg-[#1d3ad8]">Shop Bundle</button>
        </div>
      </section>

      <FilterDrawer open={drawerOpen} filters={filters} onChange={setFilters} onClose={()=>setDrawerOpen(false)} onClear={()=>setFilters(defaultFilters)}/>
      <QuickViewModal product={quick} onClose={()=>setQuick(null)}/>
    </main>
  )
}
