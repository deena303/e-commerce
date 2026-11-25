import { ArrowRight, Cpu, Gauge, Zap, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../lib/commerce'
import { useGlobalCartStore } from '../store/useGlobalCartStore'

export default function HeroShowcaseBanner() {
  const currency = useGlobalCartStore((state) => state.selectedCurrency)

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <div className="grid min-h-[440px] grid-cols-1 overflow-hidden rounded-3xl shadow-xl lg:grid-cols-12">
        <div className="flex flex-col justify-between bg-gold p-8 sm:p-12 lg:col-span-6">
          <div>
            <span className="w-fit rounded-full border border-graphite/30 px-3.5 py-1 text-xs font-bold tracking-widest text-graphite">NOVA / 2026 SERIES</span>
            <h1 className="my-4 text-4xl font-black leading-[1.05] tracking-tight text-graphite sm:text-5xl lg:text-[54px]">
              Build beyond the expected.
            </h1>
            <p className="max-w-md text-base leading-7 text-graphite/85">
              Precision hardware, globally fulfilled. Configured and tested across our North America, EU, and Asia-Pacific hubs.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/products?category=gpus" className="whitespace-nowrap rounded-full bg-cobalt px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1d3ad8]">
                Explore RTX Systems <ArrowRight className="inline" size={16}/>
              </Link>
              <Link to="/products" className="whitespace-nowrap rounded-full bg-graphite px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-elevated">
                View Global Deals
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-graphite/15 pt-6">
            {[{icon:Cpu,text:'RTX 5090'},{icon:Gauge,text:'240 FPS'},{icon:Zap,text:'4.9 GHz'},{icon:Clock3,text:'24h Dispatch'}].map(({icon:Icon,text}) => (
              <span key={text} className="flex items-center gap-2 rounded-full border border-graphite/15 bg-white/35 px-3 py-2 text-xs font-bold text-graphite">
                <Icon size={14}/>{text}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-graphite lg:col-span-6">
          <img
            src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1400&q=90"
            alt="NOVA flagship gaming workstation"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/10 to-transparent"/>
          <div className="absolute bottom-6 right-6 rounded-2xl border border-white/15 bg-graphite/75 p-4 text-white shadow-xl backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-gold">NOVA CORE</p>
            <p className="mt-1 text-lg font-black">AI-ready power</p>
            <p className="mt-2 text-sm font-bold text-gold">{formatCurrency(1849,currency)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
