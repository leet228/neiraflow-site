"use client"

import * as React from "react"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { gsap, useGSAP, reduced } from "@/lib/motion"
import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em]">
          <span data-word className={cn("inline-block will-change-transform", className)}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </>
  )
}

const stats = [
  { value: "−70%", label: "ручной рутины" },
  { value: "24/7", label: "без выходных" },
  { value: "2 сек", label: "среднее время ответа клиенту" },
]

export function Hero() {
  const root = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set("[data-word],[data-hero]", { clearProps: "all" })
        return
      }

      // Текстовый вход — отдельный таймлайн, не связанный с 3D (его Suspense-загрузка
      // не должна прерывать анимацию). clearProps снимает инлайн-стили в конце —
      // элементы гарантированно остаются видимыми.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from("[data-hero-badge]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.6,
        clearProps: "opacity,visibility,transform",
      })
        .from(
          "[data-word]",
          { yPercent: 120, duration: 0.9, stagger: 0.045, ease: "power4.out", clearProps: "transform" },
          "-=0.2"
        )
        .from(
          "[data-hero-sub]",
          { autoAlpha: 0, y: 20, duration: 0.7, clearProps: "opacity,visibility,transform" },
          "-=0.55"
        )
        .from(
          "[data-hero-cta]",
          { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.1, clearProps: "opacity,visibility,transform" },
          "-=0.45"
        )
        .from(
          "[data-hero-stat]",
          { autoAlpha: 0, y: 20, duration: 0.5, stagger: 0.08, clearProps: "opacity,visibility,transform" },
          "-=0.35"
        )

      // 3D и стрелка — отдельными твинами (вне общего таймлайна)
      gsap.from("[data-hero-3d]", { autoAlpha: 0, duration: 1, delay: 0.7, ease: "power2.out" })
      gsap.from("[data-hero-cue]", { autoAlpha: 0, duration: 0.6, delay: 1.8 })

      gsap.to(".orb-a", { x: 60, y: -40, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" })
      gsap.to(".orb-b", { x: -50, y: 50, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut" })

      gsap.to(".hero-bg", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      })

      gsap.to("[data-hero-cue] svg", {
        y: 7,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    },
    { scope: root }
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16"
    >
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-1/4" fill="white" />

      {/* Фон: сетка + orbs */}
      <div className="hero-bg pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] opacity-50" />
        <div className="orb-a absolute left-[6%] top-[16%] h-[32rem] w-[32rem] rounded-full bg-brand/20 blur-[150px]" />
        <div className="orb-b absolute right-[4%] bottom-[6%] h-[28rem] w-[28rem] rounded-full bg-cyan/15 blur-[150px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-6">
        {/* Текст */}
        <div data-hero-content className="min-w-0 text-center md:text-left">
          <div
            data-hero-badge
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-sm text-muted"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            AI-автоматизации для бизнеса под ключ
          </div>

          <h1 className="font-display text-[clamp(1.7rem,6.5vw,4rem)] font-bold leading-[1.06]">
            <span className="block">
              <Words text="Автоматизируем" />
            </span>
            <span className="block">
              <Words text="бизнес с" />
              <Words text="AI" className="text-gradient-brand" />
            </span>
          </h1>

          <p
            data-hero-sub
            className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted md:mx-0"
          >
            Чат-боты, запись клиентов, обработка заявок и документов. Рутину забирает
            NeiraFlow — вы занимаетесь делом.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
            <a
              data-hero-cta
              href="#lead"
              className={cn(buttonVariants({ variant: "brand", size: "lg" }), "group")}
            >
              Оставить заявку
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              data-hero-cta
              href="#showcase"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Как это работает
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:justify-start">
            {stats.map((s) => (
              <div data-hero-stat key={s.label} className="text-center md:text-left">
                <div className="font-display text-2xl font-bold text-gradient-brand sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 max-w-[9rem] text-xs text-faint">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D-сцена */}
        <div data-hero-3d className="relative hidden h-[460px] md:block lg:h-[600px]">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-brand/15 blur-[120px]" />
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>

      <a
        data-hero-cue
        href="#showcase"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-faint transition-colors hover:text-fg"
        aria-label="Листайте вниз"
      >
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  )
}
