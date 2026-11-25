import { FormEvent, useEffect, useState } from 'react'
import { ArrowUp, Globe2, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const storefrontLinks = [
  ['Home Storefront','/'],
  ['Full Hardware Catalog','/products'],
  ['Flash Deals (Code: GOLD15)','/products?deals=true'],
  ['Global Shopping Cart','/cart'],
  ['Express Checkout','/checkout']
] as const

const categoryLinks = [
  ['PC & GPU Systems','/products?category=PC%20%26%20GPU'],
  ['Audio & Peripherals','/products?category=Audio'],
  ['Smart Displays','/products?category=Displays'],
  ['Modular Power','/products?category=Power']
] as const

const fulfillmentLinks = [
  ['Saved / Wishlist Items','/cart'],
  ['North America Hub Stock','/products?warehouse=North%20America'],
  ['EU Central Hub Stock','/products?warehouse=EU%20Central'],
  ['Asia-Pacific Hub Stock','/products?warehouse=Asia-Pacific']
] as const

export default function GlobalFooter() {
  const [email,setEmail]=useState('')
  const [message,setMessage]=useState('')
  const [showScrollTop,setShowScrollTop]=useState(false)

  useEffect(()=>{
    const update=()=>setShowScrollTop(window.scrollY>300)
    update()
    window.addEventListener('scroll',update,{passive:true})
    return()=>window.removeEventListener('scroll',update)
  },[])

  const subscribe=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      setMessage('Enter a valid email address.')
      return
    }
    setMessage('✓ Subscribed! Use code GOLD15 at checkout')
  }

  const columns=[
    ['Storefront',storefrontLinks],
    ['Categories',categoryLinks],
    ['Fulfillment & Cart',fulfillmentLinks]
  ] as const

  return (
    <footer className="mt-auto bg-graphite text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-12 sm:px-6">
        <div className="mb-12 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-elevated p-6 md:grid-cols-2 md:p-8 lg:grid-cols-4">
          {[
            {icon:MapPin,title:'Global Hub',text:'742 Silicon Way, San Jose & Chennai'},
            {icon:Mail,title:'Mail Us',text:'support@modulo-global.io'},
            {icon:Phone,title:'24/7 Dispatch',text:'(+1) 800-555-0199'},
            {icon:Globe2,title:'modulo-global.io',text:'Multi-Warehouse Fulfillment'}
          ].map(({icon:Icon,title,text})=>(
            <div key={title} className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-graphite"><Icon size={20}/></span>
              <div><p className="text-sm font-black text-gold">{title}</p><p className="mt-1 text-xs leading-5 text-gray-300">{text}</p></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <section>
            <h2 className="text-lg font-black text-gold">Newsletter</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-300">Get instant alerts on restocked GPUs, regional warehouse drops, and exclusive global hardware promo codes.</p>
            <form onSubmit={subscribe} noValidate className="mt-5 flex items-center rounded-full bg-white p-1.5">
              <input type="email" value={email} onChange={(event)=>{setEmail(event.target.value);setMessage('')}} placeholder="Enter your email" aria-label="Email address" className="min-w-0 flex-1 px-4 text-sm text-graphite outline-none"/>
              <button type="submit" className="h-10 shrink-0 rounded-full bg-cobalt px-5 text-xs font-black text-white transition hover:bg-[#1d3ad8]">SignUp</button>
            </form>
            {message&&<p role="status" className={`mt-3 text-xs font-bold ${message.startsWith('✓')?'text-emerald':'text-coral'}`}>{message}</p>}
          </section>

          {columns.map(([title,links])=>(
            <section key={title}>
              <h2 className="text-lg font-black text-gold">{title}</h2>
              <ul className="mt-4 space-y-2.5">
                {links.map(([label,to])=>(
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-300 transition hover:text-gold">
                      <span className="mr-2 text-lg leading-none text-gold">›</span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-center text-xs text-gray-400 sm:text-left">© 2026 MODU/LO Global Hardware Commerce. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Payment and trust badges">
            {['VISA','Mastercard','UPI','Apple Pay','256-Bit SSL'].map((badge)=><span key={badge} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-black tracking-wide text-gold">{badge}</span>)}
          </div>
        </div>
      </div>

      {showScrollTop&&<button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Scroll to top" className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-cobalt text-white shadow-lg transition hover:bg-[#1d3ad8]"><ArrowUp size={18}/></button>}
    </footer>
  )
}
