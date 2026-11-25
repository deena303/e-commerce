import { Cpu, Headphones, Monitor, Smartphone, Zap } from 'lucide-react'
const categories=[['All hardware',Cpu],['Custom PCs & GPUs',Cpu],['Audio & Peripherals',Headphones],['Smart Displays',Monitor],['Modular Power',Zap],['Mobile & Smart Devices',Smartphone]] as const
export default function CategoryRailCarousel({active,setActive}:{active:string;setActive:(value:string)=>void}) {
  return <div className="mx-auto max-w-[1440px] px-4 sm:px-6"><div className="scrollbar-hide flex gap-2 overflow-x-auto py-2">{categories.map(([label,Icon])=><button key={label} onClick={()=>setActive(label)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition ${active===label?'border-cobalt bg-cobalt text-white':'border-graphite/10 bg-white text-graphite hover:border-gold'}`}><Icon size={15}/>{label}</button>)}</div></div>
}
