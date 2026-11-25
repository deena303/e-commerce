import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react'
import { mockCatalog } from '../data/mockCatalog'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { formatCurrency, taxRates } from '../lib/commerce'
import NotFoundPage from './NotFoundPage'

export default function ProductDetailPage() {
  const {slug}=useParams()
  const navigate=useNavigate()
  const product=mockCatalog.find((entry)=>entry.id===slug)
  const {selectedCurrency,selectedRegion,addToCart,toggleWishlist,wishlist}=useGlobalCartStore()
  const [angle,setAngle]=useState(0)
  const [qty,setQty]=useState(1)
  const [tab,setTab]=useState('Overview')
  const [review,setReview]=useState('')
  const [reviews,setReviews]=useState<{name:string;text:string}[]>([])
  const [selectedOptions,setSelectedOptions]=useState<Record<string,string>>({})

  if(!product) return <NotFoundPage/>

  const effectiveSelections = useMemo(()=>{
    const selections={...selectedOptions}
    product.specGroups.forEach((group)=>{
      if(!selections[group.name]) selections[group.name]=group.options.find((option)=>option.inStock)?.id||group.options[0].id
    })
    return selections
  },[product,selectedOptions])

  const selectedVariants=product.specGroups.map((group)=>{
    const id=effectiveSelections[group.name]
    return {group,option:group.options.find((option)=>option.id===id)||group.options[0]}
  })
  const priceDelta=selectedVariants.reduce((sum,item)=>sum+item.option.priceDeltaUSD,0)
  const configuredPrice=(product.basePriceUSD||product.price)+priceDelta
  const skuSuffix=selectedVariants.map((item)=>item.option.skuSuffix).join('')
  const configuredSku=`${product.sku}${skuSuffix}`
  const variantLabel=selectedVariants.map((item)=>item.option.label).join(' · ')
  const override=selectedVariants.find((item)=>item.option.imageOverride)?.option.imageOverride
  const images=override?[override,product.image,...product.images]:[product.image,...product.images]
  const isWish=wishlist.includes(product.id)
  const tabs=['Overview','Technical Specs','Global Shipping & Customs','Verified Reviews']

  const fallbackImage = (target: HTMLImageElement) => {
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="#1E1F24"/><rect x="40" y="40" width="720" height="720" rx="32" fill="#2A2C34" stroke="#D9A23A" stroke-width="4"/><circle cx="400" cy="300" r="120" fill="#D9A23A" opacity=".16"/><text x="400" y="520" fill="#D9A23A" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700">${product.brand}</text><text x="400" y="575" fill="#F8F7F4" text-anchor="middle" font-family="Arial" font-size="20">${product.sku}</text><text x="400" y="610" fill="#F8F7F4" opacity=".7" text-anchor="middle" font-family="Arial" font-size="16">${product.category}</text></svg>`
    target.onerror=null
    target.src=`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  const setOption=(groupName:string,optionId:string)=>{
    setSelectedOptions((current)=>({...current,[groupName]:optionId}))
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      <nav className="mb-5 flex flex-wrap gap-2 text-xs text-graphite/55">
        <Link to="/" className="hover:text-cobalt">Home</Link><span>/</span>
        <Link to={`/products?category=${product.category==='Custom PCs & GPUs'?'gpus':product.category==='Audio & Peripherals'?'audio':product.category==='Smart Displays'?'displays':'power'}`} className="hover:text-cobalt">{product.category}</Link><span>/</span>
        <span className="font-bold text-graphite">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(280px,1.15fr)_minmax(260px,.7fr)_340px]">
        <section>
          <div className="aspect-square overflow-hidden rounded-[24px] bg-[#ecebe7]">
            <img src={images[angle%images.length]} alt={product.name} onError={(event)=>fallbackImage(event.currentTarget)} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.08]"/>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.slice(0,4).map((image,index)=>(
              <button key={index} aria-label={`View product angle ${index+1}`} onClick={()=>setAngle(index)} className={`aspect-square overflow-hidden rounded-xl border-2 ${angle===index?'border-cobalt':'border-transparent'}`}>
                <img src={image} alt="" onError={(event)=>fallbackImage(event.currentTarget)} className="h-full w-full object-cover"/>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs font-black uppercase tracking-[.16em] text-cobalt">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{product.name}</h1>
          <a href="#reviews" className="mt-3 flex items-center gap-2 text-xs">
            <span className="flex text-gold">{[1,2,3,4,5].map((number)=><Star key={number} size={14} fill={number<=Math.round(product.rating)?'#D9A23A':'none'}/>)}</span>
            <b>{product.rating}</b><span className="text-graphite/45">{product.reviews} verified reviews</span>
          </a>
          <p className="mt-5 text-3xl font-black">{formatCurrency(configuredPrice,selectedCurrency)}</p>
          <p className="mt-2 text-sm font-bold text-emerald">In Stock at {product.warehouse} — Ships in 24h</p>
          <p className="mt-2 font-mono text-[11px] font-bold text-graphite/45">SKU {configuredSku}</p>

          <div className="mt-7 space-y-6">
            {product.specGroups.map((group)=>(
              <div key={group.name}>
                <p className="text-xs font-black uppercase tracking-wider">{group.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.options.map((option)=>(
                    <button
                      key={option.id}
                      disabled={!option.inStock}
                      onClick={()=>setOption(group.name,option.id)}
                      className={`rounded-full border px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${effectiveSelections[group.name]===option.id?'border-cobalt bg-cobalt text-white':'border-graphite/10 bg-white'}`}
                    >
                      {option.label}{!option.inStock?' — Out of stock':''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 space-y-3 rounded-2xl border border-graphite/10 bg-white p-4">
            {product.specs.map((spec)=><div key={spec} className="flex items-center gap-2 text-sm"><ShieldCheck size={15} className="text-emerald"/>{spec}</div>)}
          </div>
        </section>

        <aside className="h-fit rounded-[24px] border border-graphite/10 bg-white p-5 lg:sticky lg:top-28">
          <p className="text-xs text-graphite/45">Live regional price</p>
          <p className="mt-1 text-3xl font-black">{formatCurrency(configuredPrice,selectedCurrency)}</p>
          <p className="mt-2 font-mono text-[11px] text-graphite/50">{configuredSku}</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-emerald"><Truck size={14}/>Est. duty & shipping included</p>
          <p className="mt-1 text-[11px] text-graphite/45">Destination: {selectedRegion} · VAT {Math.round(taxRates[selectedRegion]*100)}%</p>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-bold">Quantity</span>
            <div className="flex h-10 items-center rounded-full border border-graphite/10">
              <button aria-label="Decrease quantity" disabled={qty===1} onClick={()=>setQty((value)=>Math.max(1,value-1))} className="grid h-full w-10 place-items-center disabled:opacity-30"><Minus size={14}/></button>
              <span className="w-8 text-center text-sm font-black">{qty}</span>
              <button aria-label="Increase quantity" disabled={qty>=product.maxStock} title={qty>=product.maxStock?'Maximum stock reached':undefined} onClick={()=>setQty((value)=>Math.min(product.maxStock,value+1))} className="grid h-full w-10 place-items-center disabled:opacity-30"><Plus size={14}/></button>
            </div>
          </div>

          <button onClick={()=>addToCart(product.id,qty,variantLabel,priceDelta,configuredSku,configuredPrice)} className="cobalt-sheen mt-5 h-12 w-full rounded-full bg-cobalt text-sm font-black text-white">Add to Global Cart</button>
          <button onClick={()=>{addToCart(product.id,qty,variantLabel,priceDelta,configuredSku,configuredPrice);navigate('/checkout')}} className="mt-2 h-12 w-full rounded-full bg-gold text-sm font-black text-graphite">Buy Now</button>
          <button onClick={()=>toggleWishlist(product.id)} className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-bold ${isWish?'border-coral text-coral':'border-graphite/10'}`}>
            <Heart size={16} fill={isWish?'currentColor':'none'}/>{isWish?'Saved to wishlist':'Add to Saved / Wishlist'}
          </button>
        </aside>
      </div>

      <section id="reviews" className="mt-10 rounded-[24px] border border-graphite/[.08] bg-white p-5 sm:p-7">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {tabs.map((value)=><button key={value} onClick={()=>setTab(value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${tab===value?'bg-cobalt text-white':'border border-graphite/10'}`}>{value}</button>)}
        </div>
        <div className="mt-6 min-h-36">
          <h2 className="text-xl font-black">{tab}</h2>
          {tab==='Overview'&&<p className="mt-3 max-w-3xl text-sm leading-7 text-graphite/65">Built for demanding global workflows, {product.name} combines premium {product.specs.join(', ')} with verified cross-region support and a {product.warehouse} fulfillment network.</p>}
          {tab==='Technical Specs'&&<table className="mt-4 w-full text-sm"><tbody>{product.specs.map((spec,index)=><tr key={spec} className="border-b border-graphite/10"><td className="py-3 font-bold">Specification {index+1}</td><td className="py-3 text-graphite/60">{spec}</td></tr>)}</tbody></table>}
          {tab==='Global Shipping & Customs'&&<p className="mt-3 text-sm leading-7 text-graphite/65">Ships from {product.warehouse}. Duties and regional VAT are estimated live for {selectedRegion}. Express and standard delivery tiers are available at checkout.</p>}
          {tab==='Verified Reviews'&&<div className="mt-4">
            <div className="space-y-3">{reviews.map((item,index)=><div key={index} className="rounded-xl bg-offwhite p-3"><b className="text-sm">{item.name}</b><p className="mt-1 text-sm text-graphite/60">{item.text}</p></div>)}</div>
            <form onSubmit={(event)=>{event.preventDefault();if(review.trim()){setReviews((items)=>[{name:'Verified customer',text:review.trim()},...items]);setReview('')}}} className="mt-4 flex gap-2">
              <input value={review} onChange={(event)=>setReview(event.target.value)} placeholder="Write a review" className="h-11 min-w-0 flex-1 rounded-xl border border-graphite/10 px-3 text-sm"/>
              <button className="rounded-xl bg-cobalt px-4 text-xs font-black text-white">Submit</button>
            </form>
          </div>}
        </div>
      </section>
    </main>
  )
}
