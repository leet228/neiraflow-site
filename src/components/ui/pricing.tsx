"use client"

import * as React from "react"
import { motion, useSpring } from "framer-motion"
import confetti from "canvas-confetti"
import { Check, Star, ChevronLeft, ChevronRight } from "lucide-react"
import NumberFlow from "@number-flow/react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { gsap, useGSAP } from "@/lib/motion"

/* ---------- types ---------- */

export interface PricingPlan {
  name: string
  /** Месячная цена (число). null = нестандартная цена (показываем priceText). */
  price: number | null
  yearlyPrice?: number
  priceText?: string
  /** Короткий вариант цены для мобильных (узкие карточки). */
  priceTextShort?: string
  period: string
  features: string[]
  description: string
  buttonText: string
  href: string
  isPopular?: boolean
}

interface PricingSectionProps {
  plans: PricingPlan[]
  title?: React.ReactNode
  description?: string
  id?: string
}

/* ---------- hooks ---------- */

function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)
  React.useEffect(() => {
    const result = matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setValue(e.matches)
    result.addEventListener("change", onChange)
    setValue(result.matches)
    return () => result.removeEventListener("change", onChange)
  }, [query])
  return value
}

/* ---------- interactive starfield ---------- */

type Mouse = { x: number | null; y: number | null }
type ContainerRef = React.RefObject<HTMLDivElement | null>

function StarDot({ mouse, containerRef }: { mouse: Mouse; containerRef: ContainerRef }) {
  const [s] = React.useState(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    dur: 2 + Math.random() * 3,
    delay: Math.random() * 5,
  }))

  const cfg = { stiffness: 100, damping: 15, mass: 0.1 }
  const springX = useSpring(0, cfg)
  const springY = useSpring(0, cfg)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el || mouse.x === null || mouse.y === null) {
      springX.set(0)
      springY.set(0)
      return
    }
    const r = el.getBoundingClientRect()
    const sx = r.left + (parseFloat(s.left) / 100) * r.width
    const sy = r.top + (parseFloat(s.top) / 100) * r.height
    const dx = mouse.x - sx
    const dy = mouse.y - sy
    const dist = Math.hypot(dx, dy)
    const radius = 600
    if (dist < radius) {
      const f = 1 - dist / radius
      springX.set(dx * f * 0.5)
      springY.set(dy * f * 0.5)
    } else {
      springX.set(0)
      springY.set(0)
    }
  }, [mouse, s, containerRef, springX, springY])

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{ top: s.top, left: s.left, width: s.size, height: s.size, x: springX, y: springY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0] }}
      transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
    />
  )
}

function Starfield({ mouse, containerRef }: { mouse: Mouse; containerRef: ContainerRef }) {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      {Array.from({ length: 110 }).map((_, i) => (
        <StarDot key={i} mouse={mouse} containerRef={containerRef} />
      ))}
    </div>
  )
}

/* ---------- context ---------- */

const PricingContext = React.createContext<{
  isMonthly: boolean
  setIsMonthly: (v: boolean) => void
}>({ isMonthly: true, setIsMonthly: () => {} })

/* ---------- toggle ---------- */

function PricingToggle() {
  const { isMonthly, setIsMonthly } = React.useContext(PricingContext)
  const monthlyRef = React.useRef<HTMLButtonElement>(null)
  const annualRef = React.useRef<HTMLButtonElement>(null)
  const [pill, setPill] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    const b = isMonthly ? monthlyRef.current : annualRef.current
    if (b) setPill({ width: b.offsetWidth, transform: `translateX(${b.offsetLeft}px)` })
  }, [isMonthly])

  const toggle = (monthly: boolean) => {
    if (isMonthly === monthly) return
    setIsMonthly(monthly)
    if (!monthly && annualRef.current) {
      const r = annualRef.current.getBoundingClientRect()
      confetti({
        particleCount: 80,
        spread: 80,
        origin: {
          x: (r.left + r.width / 2) / window.innerWidth,
          y: (r.top + r.height / 2) / window.innerHeight,
        },
        colors: ["#34d399", "#22d3ee", "#a7f3d0", "#ffffff"],
        ticks: 250,
        gravity: 1.1,
        decay: 0.93,
        startVelocity: 30,
      })
    }
  }

  return (
    <div className="flex justify-center">
      <div className="relative flex w-fit items-center rounded-full border border-border bg-white/[0.04] p-1">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-brand p-1"
          style={pill}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
        <button
          ref={monthlyRef}
          onClick={() => toggle(true)}
          className={cn(
            "relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors",
            isMonthly ? "text-bg" : "text-muted hover:text-fg"
          )}
        >
          Помесячно
        </button>
        <button
          ref={annualRef}
          onClick={() => toggle(false)}
          className={cn(
            "relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors",
            !isMonthly ? "text-bg" : "text-muted hover:text-fg"
          )}
        >
          На год
          <span className={cn("hidden sm:inline", !isMonthly ? "text-bg/80" : "text-brand")}>
            {" "}
            −20%
          </span>
        </button>
      </div>
    </div>
  )
}

/* ---------- card ---------- */

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const { isMonthly } = React.useContext(PricingContext)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: plan.isPopular && isDesktop ? -20 : 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20, delay: index * 0.12 }}
      className={cn(
        "relative flex h-full flex-col rounded-2xl p-7 backdrop-blur-md sm:p-8",
        plan.isPopular
          ? "border-2 border-brand/60 bg-brand/[0.08] shadow-[0_0_70px_-22px_var(--brand-glow)]"
          : "border border-border bg-card/70"
      )}
    >
      {plan.isPopular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5">
            <Star className="h-4 w-4 fill-current text-bg" />
            <span className="text-sm font-semibold text-bg">Популярный</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col text-center">
        <h3 className="font-display text-lg font-semibold sm:text-xl">{plan.name}</h3>
        <p className="mt-2 text-sm text-muted">{plan.description}</p>

        <div className="mt-6 flex items-baseline justify-center gap-x-1.5">
          {plan.price !== null ? (
            <>
              <span className="text-base font-medium text-muted">От</span>
              <span className="font-display text-[1.9rem] font-bold leading-none tracking-tight tabular-nums sm:text-4xl lg:text-[2.6rem]">
                <NumberFlow
                  value={isMonthly ? plan.price : plan.yearlyPrice ?? plan.price}
                  format={{ style: "currency", currency: "RUB", maximumFractionDigits: 0 }}
                  locales="ru-RU"
                />
              </span>
              <span className="text-sm font-semibold text-muted">/ {plan.period}</span>
            </>
          ) : (
            <span className="font-display text-xl font-bold tracking-tight text-gradient-brand sm:text-2xl lg:text-3xl">
              {plan.priceText}
            </span>
          )}
        </div>

        {plan.price !== null && (
          <p className="mt-2 text-xs text-faint">
            {isMonthly ? "Оплата помесячно" : "Оплата за год"}
          </p>
        )}

        <ul className="mt-7 space-y-3 text-left text-sm leading-6">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-x-3">
              <Check className="h-5 w-5 flex-none text-brand" aria-hidden />
              <span className="text-fg/85">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          <a
            href={plan.href}
            className={cn(
              buttonVariants({ variant: plan.isPopular ? "brand" : "outline", size: "lg" }),
              "w-full"
            )}
          >
            {plan.buttonText}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- мобильная карусель ---------- */

function PricingCarousel({ plans }: { plans: PricingPlan[] }) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(1)

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      const items = gsap.utils.toArray<HTMLElement>(track.querySelectorAll("[data-card]"))
      if (!items.length) return

      const update = () => {
        const center = track.scrollLeft + track.clientWidth / 2
        let nearest = 0
        let min = Infinity
        items.forEach((it, i) => {
          const c = it.offsetLeft + it.offsetWidth / 2
          const dist = Math.abs(c - center)
          if (dist < min) {
            min = dist
            nearest = i
          }
          const t = Math.min(1, dist / track.clientWidth)
          gsap.set(it, { scale: 1 - t * 0.12, opacity: 1 - t * 0.5 })
        })
        setActive((p) => (p === nearest ? p : nearest))
      }

      // центрируем популярный тариф на старте
      const popularIdx = Math.max(0, plans.findIndex((p) => p.isPopular))
      const it = items[popularIdx]
      track.scrollLeft = it.offsetLeft - (track.clientWidth - it.offsetWidth) / 2
      update()

      track.addEventListener("scroll", update, { passive: true })
      return () => track.removeEventListener("scroll", update)
    },
    { scope: trackRef }
  )

  const scrollTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const items = track.querySelectorAll<HTMLElement>("[data-card]")
    const it = items[Math.max(0, Math.min(items.length - 1, i))]
    if (it) {
      track.scrollTo({
        left: it.offsetLeft - (track.clientWidth - it.offsetWidth) / 2,
        behavior: "smooth",
      })
    }
  }

  const arrowBase =
    "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/80 text-fg shadow-lg backdrop-blur transition-all duration-300 hover:border-brand/50 hover:text-brand"

  return (
    <div className="lg:hidden">
      <div className="relative">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 pt-8 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {plans.map((plan, i) => (
            <div key={plan.name} data-card className="w-[76vw] max-w-[300px] shrink-0 snap-center">
              <PricingCard plan={plan} index={i} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollTo(active - 1)}
          aria-label="Предыдущий тариф"
          className={cn(arrowBase, "left-1.5", active === 0 && "pointer-events-none opacity-0")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollTo(active + 1)}
          aria-label="Следующий тариф"
          className={cn(
            arrowBase,
            "right-1.5",
            active === plans.length - 1 && "pointer-events-none opacity-0"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {plans.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Тариф ${p.name}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              active === i ? "w-6 bg-brand" : "w-2 bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------- section ---------- */

export function PricingSection({ plans, title, description, id }: PricingSectionProps) {
  const [isMonthly, setIsMonthly] = React.useState(true)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = React.useState<Mouse>({ x: null, y: null })
  // Звёзды используют random-позиции — рендерим только на клиенте, чтобы не было hydration mismatch.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <PricingContext.Provider value={{ isMonthly, setIsMonthly }}>
      <div
        id={id}
        ref={containerRef}
        onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setMouse({ x: null, y: null })}
        className="relative w-full overflow-hidden px-6 py-24 sm:py-32"
      >
        {mounted && <Starfield mouse={mouse} containerRef={containerRef} />}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">Тарифы</div>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">{title}</h2>
            {description && (
              <p className="mt-4 whitespace-pre-line text-lg text-muted">{description}</p>
            )}
          </div>

          <div className="mt-10">
            <PricingToggle />
          </div>

          {/* Десктоп — сетка */}
          <div className="mt-14 hidden grid-cols-3 items-stretch gap-6 lg:grid">
            {plans.map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} index={i} />
            ))}
          </div>

          {/* Мобайл — карусель */}
          <PricingCarousel plans={plans} />
        </div>
      </div>
    </PricingContext.Provider>
  )
}
