import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowRight, Check, ChevronLeft, ChevronRight, Heart, Maximize2, Minus, Plus, ShieldCheck, ShoppingCart, Sparkles, Star, X, ZoomIn } from 'lucide-react'
import { useGlobalCartStore } from '@/store/useGlobalCartStore'
import { fx } from '@/lib/commerce'

export interface DeviceImageView {
  label: string
  src: string
  focus?: [number, number]
  zoom?: number
}

export interface DeviceFinish {
  id: string
  name: string
  skuSuffix: string
  priceDeltaUSD?: number
  inStock?: boolean
  swatch: string
  tint: string
  images: DeviceImageView[]
}

export interface DeviceSpecification {
  id: string
  label: string
  priceINR: number
  mrpINR?: number
  skuSuffix: string
  inStock?: boolean
}

export interface DeviceProduct {
  id: string
  name: string
  brand: string
  brandTag: string
  seriesLabel: string
  sku: string
  headline: string
  subheadline: string
  highlights: string[]
  finishes: DeviceFinish[]
  specifications: DeviceSpecification[]
  configurationLabel?: string
  rating?: number
  reviews?: number
  maxStock?: number
}

interface DeviceProductSelection {
  product: DeviceProduct
  finish: DeviceFinish
  specification: DeviceSpecification
  priceINR: number
  quantity: number
}

interface DeviceProductHeroProps {
  product: DeviceProduct
  onAddToCart: (selection: DeviceProductSelection) => void
  onBuyNow?: (selection: DeviceProductSelection) => void
}

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(amount)

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return reducedMotion
}

export default function DeviceProductHero({ product, onAddToCart, onBuyNow }: DeviceProductHeroProps) {
  const [finishIndex, setFinishIndex] = useState(() => Math.max(0, product.finishes.findIndex((finish) => finish.inStock !== false)))
  const [viewIndex, setViewIndex] = useState(0)
  const [specificationIndex, setSpecificationIndex] = useState(() => Math.max(0, product.specifications.findIndex((specification) => specification.inStock !== false)))
  const [quantity, setQuantity] = useState(1)
  const [loupe, setLoupe] = useState<{ x: number; y: number; active: boolean }>({ x: 50, y: 50, active: false })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef<HTMLImageElement>(null)
  const priceRef = useRef<HTMLSpanElement>(null)
  const previousPriceRef = useRef((product.specifications[0]?.priceINR ?? 0) + (product.finishes[0]?.priceDeltaUSD ?? 0) * fx.INR)
  const reducedMotion = usePrefersReducedMotion()
  const wishlist = useGlobalCartStore((state) => state.wishlist)
  const toggleWishlist = useGlobalCartStore((state) => state.toggleWishlist)

  const finish = product.finishes[finishIndex]
  const specification = product.specifications[specificationIndex]
  const images = finish?.images ?? []
  const view = images[viewIndex] ?? images[0]
  const isWishlisted = wishlist.includes(product.id)
  const priceINR = specification ? specification.priceINR + (finish?.priceDeltaUSD ?? 0) * fx.INR : 0
  const mrpINR = specification?.mrpINR === undefined ? undefined : specification.mrpINR + (finish?.priceDeltaUSD ?? 0) * fx.INR
  const selection = finish && specification ? { product, finish, specification, priceINR, quantity } : null

  useEffect(() => {
    if (!rootRef.current || reducedMotion) return
    const context = gsap.context(() => {
      gsap.fromTo('.device-reveal', { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: 'power3.out'
      })
      gsap.to('.device-float', {
        y: -7,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
      gsap.fromTo('.device-sweep', { xPercent: -150 }, {
        xPercent: 250,
        duration: 1.1,
        delay: 0.35,
        ease: 'power2.inOut'
      })
    }, rootRef)
    return () => context.revert()
  }, [reducedMotion])

  useEffect(() => {
    const image = deviceRef.current
    if (!image) return
    if (reducedMotion) {
      gsap.set(image, { autoAlpha: 1, scale: 1 })
      return
    }
    gsap.fromTo(image, { autoAlpha: 0.35, scale: 0.97 }, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.38,
      ease: 'power2.out'
    })
  }, [finishIndex, viewIndex, reducedMotion])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || reducedMotion) return
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = stage.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      gsap.to(stage, {
        rotateY: x * 5,
        rotateX: y * -5,
        transformPerspective: 1100,
        duration: 0.35,
        ease: 'power2.out'
      })
    }
    const resetTilt = () => gsap.to(stage, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'power3.out' })
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerleave', resetTilt)
    return () => {
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', resetTilt)
      gsap.killTweensOf(stage)
      gsap.set(stage, { clearProps: 'transform' })
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowRight') setViewIndex((current) => (current + 1) % images.length)
      if (event.key === 'ArrowLeft') setViewIndex((current) => (current - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, images.length])

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1800)
    return () => window.clearTimeout(timer)
  }, [added])

  useEffect(() => {
    if (!priceRef.current || !specification) return
    const currentPriceINR = specification.priceINR + (finish?.priceDeltaUSD ?? 0) * fx.INR
    if (reducedMotion) {
      priceRef.current.textContent = formatINR(currentPriceINR)
      previousPriceRef.current = currentPriceINR
      return
    }
    const counter = { value: previousPriceRef.current }
    const tween = gsap.to(counter, {
      value: currentPriceINR,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: () => {
        if (priceRef.current) priceRef.current.textContent = formatINR(counter.value)
      },
      onComplete: () => {
        if (priceRef.current) priceRef.current.textContent = formatINR(priceINR)
      }
    })
    previousPriceRef.current = currentPriceINR
    return () => {
      tween.kill()
    }
  }, [specification, finish, reducedMotion])

  const selectFinish = (index: number) => {
    setFinishIndex(index)
    setViewIndex(0)
    setAdded(false)
    setLoupe((current) => ({ ...current, active: false }))
  }

  const selectSpecification = (index: number) => {
    setSpecificationIndex(index)
    setAdded(false)
  }

  const moveView = (direction: number) => {
    setViewIndex((current) => (current + direction + images.length) % images.length)
    setLoupe((current) => ({ ...current, active: false }))
  }

  const handleLoupeMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    setLoupe((current) => ({
      ...current,
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100
    }))
  }

  const handleAddToCart = () => {
    if (!selection || specification.inStock === false || finish.inStock === false) return
    onAddToCart(selection)
    setAdded(true)
  }

  const handleBuyNow = () => {
    if (!selection || !onBuyNow || specification.inStock === false || finish.inStock === false) return
    onBuyNow(selection)
  }

  if (!finish || !specification || !view) return null

  return (
    <section ref={rootRef} className="relative isolate w-full min-w-0 overflow-hidden rounded-[2rem] bg-[#f1f0eb] text-foreground">
      <div className="absolute -left-36 -top-32 -z-10 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: finish.tint }} />
      <div className="absolute -bottom-48 right-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-white/70 blur-3xl" />

      <div className="grid min-h-[620px] min-w-0 grid-cols-1 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex min-w-0 flex-col justify-center px-6 pb-8 pt-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="device-reveal flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-foreground/55">
            <Sparkles size={14} className="text-foreground" />
            {product.brandTag}
          </div>
          <p className="device-reveal mt-8 text-xs font-bold uppercase tracking-[.16em] text-foreground/50">{product.seriesLabel}</p>
          <h1 className="device-reveal mt-2 max-w-xl text-5xl font-black leading-[.98] tracking-[-.06em] sm:text-6xl xl:text-7xl">
            {product.headline}
          </h1>
          <p className="device-reveal mt-5 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {product.subheadline}
          </p>
          {product.rating !== undefined && product.reviews !== undefined && (
            <a href="#reviews" className="device-reveal mt-4 flex w-fit items-center gap-2 text-xs">
              <span className="flex text-amber-500">{[1, 2, 3, 4, 5].map((number) => <Star key={number} size={13} fill={number <= Math.round(product.rating ?? 0) ? 'currentColor' : 'none'} />)}</span>
              <b>{product.rating.toFixed(1)}</b><span className="text-muted-foreground">{product.reviews.toLocaleString('en-IN')} reviews</span>
            </a>
          )}
          <div className="device-reveal mt-5 flex flex-wrap gap-2">
            {product.highlights.map((highlight) => (
              <span key={highlight} className="rounded-full border border-foreground/10 bg-white/60 px-3 py-1.5 text-[10px] font-bold text-foreground/65">
                {highlight}
              </span>
            ))}
          </div>

          <div className="device-reveal mt-7 flex flex-wrap items-baseline gap-3">
            <span ref={priceRef} className="text-2xl font-black tracking-tight">{formatINR(priceINR)}</span>
            {mrpINR !== undefined && mrpINR > priceINR && <span className="text-sm font-semibold text-muted-foreground line-through">{formatINR(mrpINR)}</span>}
            <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-foreground/65">Free shipping</span>
            <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-foreground/65">1-year warranty</span>
          </div>

          <div className="device-reveal mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-black">Finish <span className="font-medium text-muted-foreground">/ {finish.name}</span></span>
              <span className="text-[10px] font-semibold text-muted-foreground">{product.finishes.length} {product.finishes.length === 1 ? 'finish' : 'finishes'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.finishes.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Select ${item.name} finish`}
                  aria-pressed={finishIndex === index}
                  disabled={item.inStock === false}
                  title={item.name}
                  onClick={() => selectFinish(index)}
                  className={`grid h-9 w-9 place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${finishIndex === index ? 'ring-2 ring-foreground ring-offset-2 ring-offset-[#f1f0eb]' : 'ring-1 ring-foreground/10 hover:ring-foreground/40'}`}
                  style={{ backgroundColor: item.swatch }}
                >
                  {finishIndex === index && <Check size={14} className={['Natural Titanium', 'Silver', 'Gold'].some((color) => item.name.includes(color)) ? 'text-foreground' : 'text-white'} />}
                </button>
              ))}
            </div>
          </div>

          <div className="device-reveal mt-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-black">{product.configurationLabel ?? 'Select configuration'}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">Spec guide</span>
            </div>
            <div className="grid max-w-md grid-cols-3 gap-2">
              {product.specifications.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={specificationIndex === index}
                  disabled={item.inStock === false}
                  onClick={() => selectSpecification(index)}
                  className={`min-h-12 rounded-xl border px-2 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${specificationIndex === index ? 'border-foreground bg-foreground text-white' : 'border-foreground/10 bg-white/65 hover:border-foreground/40'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {product.maxStock !== undefined && (
            <div className="device-reveal mt-6 flex items-center justify-between">
              <span className="text-xs font-black">Quantity</span>
              <div className="flex h-9 items-center rounded-full border border-foreground/10 bg-white/60">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-full w-9 place-items-center disabled:opacity-30"><Minus size={13} /></button>
                <span className="w-8 text-center text-xs font-black">{quantity}</span>
                <button type="button" aria-label="Increase quantity" disabled={quantity >= product.maxStock} onClick={() => setQuantity((value) => Math.min(product.maxStock ?? value, value + 1))} className="grid h-full w-9 place-items-center disabled:opacity-30"><Plus size={13} /></button>
              </div>
            </div>
          )}

          <div className="device-reveal mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={handleAddToCart} disabled={specification.inStock === false || finish.inStock === false} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-xs font-black text-white transition hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-40">
              {added ? <><Check size={15} /> Added to cart</> : <><ShoppingCart size={15} /> Add to cart</>}
              {!added && <ArrowRight size={14} className="transition group-hover:translate-x-1" />}
            </button>
            {onBuyNow && <button type="button" onClick={handleBuyNow} disabled={specification.inStock === false || finish.inStock === false} className="h-12 rounded-full border border-foreground/15 bg-white/70 px-6 text-xs font-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">Buy now</button>}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
              className="grid h-12 w-12 place-items-center rounded-full border border-foreground/15 bg-white/70 transition hover:bg-white"
            >
              <Heart size={17} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
            </button>
          </div>
          <p className="device-reveal mt-5 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
            <ShieldCheck size={13} /> Secure checkout · 7-day replacement
          </p>
        </div>

        <div className="relative flex min-h-[390px] min-w-0 flex-col justify-center px-4 pb-8 sm:px-8 lg:min-h-0 lg:py-10">
          <div className="absolute right-8 top-8 z-10 flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-2 text-[10px] font-bold text-foreground/65 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: finish.tint }} />
            Precision-built hardware
          </div>
          <div
            ref={stageRef}
            className="relative mx-auto grid aspect-[4/3] w-full min-w-0 max-w-[620px] place-items-center"
            onPointerMove={handleLoupeMove}
            onPointerDown={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect()
              setLoupe({
                x: ((event.clientX - bounds.left) / bounds.width) * 100,
                y: ((event.clientY - bounds.top) / bounds.height) * 100,
                active: true
              })
            }}
            onPointerUp={() => setLoupe((current) => ({ ...current, active: false }))}
            onPointerCancel={() => setLoupe((current) => ({ ...current, active: false }))}
            onPointerLeave={() => setLoupe((current) => ({ ...current, active: false }))}
          >
            <div className="absolute inset-[8%] rounded-full opacity-25 blur-3xl" style={{ backgroundColor: finish.tint }} />
            <div className="device-sweep pointer-events-none absolute -left-1/3 top-0 z-10 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <div className="pointer-events-none absolute bottom-[12%] left-[18%] right-[18%] h-[14%] rounded-[50%] bg-foreground/15 blur-2xl" />
            <button type="button" onClick={() => setLightboxOpen(true)} className="relative z-[1] flex h-full w-full items-center justify-center" aria-label={`Open ${product.name} image gallery`}>
              <img
                ref={deviceRef}
                key={`${finish.id}-${view.src}-${viewIndex}`}
                src={view.src}
                alt={`${product.name} in ${finish.name} — ${view.label}`}
                className="device-float mx-auto max-h-[430px] max-w-full select-none object-contain drop-shadow-[0_26px_24px_rgba(27,30,39,0.22)]"
                draggable={false}
              />
            </button>
            {loupe.active && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute z-20 h-28 w-28 rounded-full border-4 border-white/90 shadow-xl"
                style={{
                  left: `${loupe.x}%`,
                  top: `${loupe.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url("${view.src}")`,
                  backgroundSize: `${(view.zoom ?? 2.2) * 100}% auto`,
                  backgroundPosition: `${view.focus?.[0] ?? loupe.x}% ${view.focus?.[1] ?? loupe.y}%`
                }}
              />
            )}
            <span className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/75 px-3 py-2 text-[10px] font-bold text-foreground shadow-sm backdrop-blur">
              <ZoomIn size={13} /> Hold to inspect
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Expand product image"
              className="absolute bottom-4 left-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/75 bg-white/75 text-foreground shadow-sm backdrop-blur transition hover:bg-white"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {images.length > 1 && (
            <div className="relative z-10 mx-auto flex w-full max-w-[620px] items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => moveView(-1)}
                aria-label="Previous product view"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/10 bg-white/70 transition hover:bg-white"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex max-w-full items-center gap-2 overflow-x-auto py-1">
                {images.map((item, index) => (
                  <button
                    key={`${item.label}-${index}`}
                    type="button"
                    aria-label={`View ${item.label}`}
                    aria-pressed={viewIndex === index}
                    onClick={() => setViewIndex(index)}
                    className={`h-10 shrink-0 rounded-full border px-3 text-[10px] font-bold transition ${viewIndex === index ? 'border-foreground bg-foreground text-white' : 'border-foreground/10 bg-white/60 text-foreground/65 hover:bg-white'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => moveView(1)}
                aria-label="Next product view"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/10 bg-white/70 transition hover:bg-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          <p className="mt-3 text-center text-[10px] font-medium text-muted-foreground">Press and hold the image to inspect details · click to open gallery</p>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-foreground/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${product.name} image gallery`} onClick={() => setLightboxOpen(false)}>
          <button type="button" aria-label="Close image gallery" onClick={() => setLightboxOpen(false)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <X size={20} />
          </button>
          {images.length > 1 && (
            <button type="button" aria-label="Previous gallery image" onClick={(event) => { event.stopPropagation(); moveView(-1) }} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronLeft size={20} />
            </button>
          )}
          <figure className="relative flex max-h-full w-full max-w-5xl flex-col items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img src={view.src} alt={`${product.name} in ${finish.name} — ${view.label}`} className="max-h-[80vh] max-w-full object-contain drop-shadow-2xl" />
            <figcaption className="mt-4 text-sm font-semibold text-white/75">{finish.name} · {view.label} · {viewIndex + 1} of {images.length}</figcaption>
          </figure>
          {images.length > 1 && (
            <button type="button" aria-label="Next gallery image" onClick={(event) => { event.stopPropagation(); moveView(1) }} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </section>
  )
}
