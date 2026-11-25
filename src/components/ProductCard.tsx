import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Plus, Check, Star } from 'lucide-react'
import type { Product } from '../types'
import { formatCurrency } from '../lib/commerce'
import { useGlobalCartStore } from '../store/useGlobalCartStore'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (product: Product) => void }) {
  const [added, setAdded] = useState(false)
  const { selectedCurrency, addToCart } = useGlobalCartStore()
  const cartQty = useGlobalCartStore((state) => state.cartItems.find((item) => item.productId === product.id)?.quantity || 0)
  const atMax = cartQty >= product.maxStock

  useEffect(() => () => setAdded(false), [])

  const fallbackImage = () => {
    const label = `${product.brand} · ${product.category}`
    const escape = (value:string) => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560"><rect width="800" height="560" fill="#1E1F24"/><rect x="24" y="24" width="752" height="512" rx="24" fill="#2A2C34" stroke="#D9A23A" stroke-width="3"/><circle cx="400" cy="220" r="90" fill="#D9A23A" opacity=".18"/><path d="M360 220h80M400 180v80" stroke="#D9A23A" stroke-width="8"/><text x="400" y="360" fill="#D9A23A" text-anchor="middle" font-family="Arial" font-size="26" font-weight="700">${escape(product.brand)}</text><text x="400" y="398" fill="#F8F7F4" text-anchor="middle" font-family="Arial" font-size="18">${escape(product.sku)}</text><text x="400" y="430" fill="#F8F7F4" opacity=".7" text-anchor="middle" font-family="Arial" font-size="14">${escape(label)}</text></svg>`)}`
  }

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (atMax || added) return
    addToCart(product.id)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="relative group overflow-hidden rounded-2xl border border-graphite/[.07] bg-white shadow-sm"
    >
      <Link to={`/product/${product.id}`} className="relative block w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = fallbackImage()
          }}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-graphite">{product.badge}</span>}
        <span className="absolute bottom-3 left-3 rounded-full bg-emerald px-2.5 py-1 text-[10px] font-bold text-white">In stock</span>
      </Link>

      <button
        onClick={(event) => { event.preventDefault(); event.stopPropagation(); onQuickView(product) }}
        aria-label={`Quick view ${product.name}`}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-graphite opacity-0 shadow-md transition-opacity group-hover:opacity-100"
      >
        <Eye size={16}/>
      </button>

      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[.16em] text-graphite/45">{product.brand} · {product.warehouse.replace(' Hub','')}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 min-h-11 text-sm font-bold leading-5 text-graphite hover:text-cobalt">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star size={13} fill="#D9A23A" className="text-gold"/>
          <b>{product.rating}</b>
          <span className="text-graphite/45">({product.reviews})</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-black">{formatCurrency(product.price, selectedCurrency)}</p>
            {product.originalPrice && <p className="text-xs text-graphite/40 line-through">{formatCurrency(product.originalPrice, selectedCurrency)}</p>}
          </div>
          <motion.button
            layout
            title={atMax ? 'Maximum stock reached' : undefined}
            disabled={atMax}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            animate={{ backgroundColor: added ? '#10B981' : atMax ? '#2448FF' : '#2448FF' }}
            transition={{ duration: 0.25 }}
            className="flex h-11 min-w-[78px] items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? <><Check size={16}/><span>Added</span></> : <><Plus size={16}/><span>Add</span></>}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
