import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DeviceProductHero from '@/components/ui/device-product-hero'
import { mockCatalog } from '@/data/mockCatalog'
import { toDeviceProductHero } from '@/lib/deviceProductHero'
import { fx, taxRates } from '@/lib/commerce'
import { useGlobalCartStore } from '@/store/useGlobalCartStore'
import NotFoundPage from './NotFoundPage'

const tabs = ['Overview', 'Technical Specs', 'Global Shipping & Customs', 'Verified Reviews']

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = mockCatalog.find((entry) => entry.id === slug)
  const { addToCart, selectedRegion, setCartOpen } = useGlobalCartStore()
  const [tab, setTab] = useState('Overview')
  const [review, setReview] = useState('')
  const [reviews, setReviews] = useState<{ name: string; text: string }[]>([])
  const heroProduct = useMemo(() => product ? toDeviceProductHero(product) : null, [product])

  if (!product || !heroProduct) return <NotFoundPage />

  const categoryPath: Record<string, string> = {
    'Custom PCs & GPUs': 'gpus',
    'Audio & Peripherals': 'audio',
    'Smart Displays': 'displays',
    'Modular Power': 'power',
    'Mobile & Smart Devices': 'mobile'
  }

  const addConfiguredProduct = (
    selection: Parameters<React.ComponentProps<typeof DeviceProductHero>['onAddToCart']>[0],
    openCart: boolean
  ) => {
    const configuredPriceUSD = selection.priceINR / fx.INR
    const priceDeltaUSD = configuredPriceUSD - product.basePriceUSD
    const variant = `${selection.specification.label} · ${selection.finish.name}`
    const sku = `${product.sku}${selection.specification.skuSuffix}${selection.finish.skuSuffix}`
    addToCart(product.id, selection.quantity, variant, priceDeltaUSD, sku, configuredPriceUSD)
    if (openCart) setCartOpen(true)
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      <nav className="mb-5 flex flex-wrap gap-2 text-xs text-graphite/55">
        <Link to="/" className="hover:text-cobalt">Home</Link><span>/</span>
        <Link to={`/products?category=${categoryPath[product.category]}`} className="hover:text-cobalt">{product.category}</Link><span>/</span>
        <span className="font-bold text-graphite">{product.name}</span>
      </nav>

      <DeviceProductHero
        key={product.id}
        product={heroProduct}
        onAddToCart={(selection) => addConfiguredProduct(selection, true)}
        onBuyNow={(selection) => {
          addConfiguredProduct(selection, false)
          navigate('/checkout')
        }}
      />

      <p className="mt-4 rounded-2xl border border-graphite/10 bg-white/80 px-4 py-3 text-xs leading-5 text-graphite/60">
        In stock at {product.warehouse} · Ships in 24 hours · Duties and regional VAT are estimated for {selectedRegion} ({Math.round(taxRates[selectedRegion] * 100)}%).
      </p>

      <section id="reviews" className="mt-10 rounded-[24px] border border-graphite/[.08] bg-white p-5 sm:p-7">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {tabs.map((value) => (
            <button key={value} onClick={() => setTab(value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${tab === value ? 'bg-cobalt text-white' : 'border border-graphite/10'}`}>
              {value}
            </button>
          ))}
        </div>
        <div className="mt-6 min-h-36">
          <h2 className="text-xl font-black">{tab}</h2>
          {tab === 'Overview' && (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-graphite/65">
              Built for demanding global workflows, {product.name} combines premium {product.specs.join(', ')} with verified cross-region support and a {product.warehouse} fulfillment network.
            </p>
          )}
          {tab === 'Technical Specs' && (
            <table className="mt-4 w-full text-sm">
              <tbody>
                {product.specs.map((spec, index) => (
                  <tr key={spec} className="border-b border-graphite/10">
                    <td className="py-3 font-bold">Specification {index + 1}</td>
                    <td className="py-3 text-graphite/60">{spec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'Global Shipping & Customs' && (
            <p className="mt-3 text-sm leading-7 text-graphite/65">
              Ships from {product.warehouse}. Duties and regional VAT are estimated live for {selectedRegion}. Express and standard delivery tiers are available at checkout.
            </p>
          )}
          {tab === 'Verified Reviews' && (
            <div className="mt-4">
              <div className="space-y-3">
                {reviews.map((item, index) => (
                  <div key={index} className="rounded-xl bg-offwhite p-3">
                    <b className="text-sm">{item.name}</b>
                    <p className="mt-1 text-sm text-graphite/60">{item.text}</p>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  if (review.trim()) {
                    setReviews((items) => [{ name: 'Verified customer', text: review.trim() }, ...items])
                    setReview('')
                  }
                }}
                className="mt-4 flex gap-2"
              >
                <input value={review} onChange={(event) => setReview(event.target.value)} placeholder="Write a review" className="h-11 min-w-0 flex-1 rounded-xl border border-graphite/10 px-3 text-sm" />
                <button className="rounded-xl bg-cobalt px-4 text-xs font-black text-white">Submit</button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
