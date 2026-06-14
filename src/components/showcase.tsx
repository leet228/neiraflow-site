"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/motion"
import { DeviceFrame, SCENES, type Scene } from "@/components/showcase-scenes"

function CopyBlock({ s }: { s: Scene }) {
  return (
    <div className="text-center lg:text-left">
      <div className="mb-3 flex items-center justify-center gap-3 lg:mb-4 lg:justify-start">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand lg:h-10 lg:w-10">
          <s.icon className="h-4 w-4 lg:h-5 lg:w-5" />
        </span>
        <span className="font-display text-sm font-semibold tracking-widest text-faint">
          {s.step} <span className="text-faint/40">/ 04</span>
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
        {s.title}
      </h3>
      <p className="mx-auto mt-3 hidden max-w-md text-base text-muted sm:block lg:mx-0 lg:mt-4 lg:text-lg">
        {s.desc}
      </p>
      <ul className="mt-6 hidden space-y-2.5 lg:block">
        {s.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2.5 text-fg/85">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
              <Check className="h-3 w-3" />
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Showcase() {
  const root = React.useRef<HTMLElement>(null)
  const pinRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const scenes = gsap.utils.toArray<HTMLElement>(
        pinRef.current!.querySelectorAll("[data-scene]")
      )
      const copies = gsap.utils.toArray<HTMLElement>(
        pinRef.current!.querySelectorAll("[data-copy]")
      )
      const n = scenes.length

      if (reduced()) {
        gsap.set(scenes, { autoAlpha: 0 })
        gsap.set(scenes[0], { autoAlpha: 1 })
        gsap.set(copies, { autoAlpha: 0 })
        gsap.set(copies[0], { autoAlpha: 1 })
        return
      }

      ScrollTrigger.config({ ignoreMobileResize: true })

      gsap.set(scenes, { autoAlpha: 0, scale: 1.04 })
      gsap.set(scenes[0], { autoAlpha: 1, scale: 1 })
      gsap.set(copies, { autoAlpha: 0, y: 20 })
      gsap.set(copies[0], { autoAlpha: 1, y: 0 })
      gsap.set(".sc-fill", { scaleX: 1 / n })

      // Графики аналитики (последняя сцена) — стартовое «неотрисованное» состояние
      const aLine = pinRef.current!.querySelectorAll(".an-line")
      const aArc = pinRef.current!.querySelectorAll(".an-arc")
      const aArea = pinRef.current!.querySelectorAll(".an-area")
      const aBars = pinRef.current!.querySelectorAll(".an-bar")
      gsap.set(aLine, { strokeDashoffset: 1 })
      gsap.set(aArc, { strokeDashoffset: 1 })
      gsap.set(aArea, { autoAlpha: 0, yPercent: 18 })
      gsap.set(aBars, { scaleY: 0, transformOrigin: "50% 100%" })

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=" + n * 620,
          pin: true,
          scrub: 1,
        },
      })

      for (let i = 1; i < n; i++) {
        tl.to(copies[i - 1], { autoAlpha: 0, y: -20, duration: 0.45 }, i)
          .to(scenes[i - 1], { autoAlpha: 0, scale: 0.95, duration: 0.45 }, i)
          .fromTo(copies[i], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45 }, i + 0.2)
          .fromTo(scenes[i], { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.45 }, i + 0.2)
          .to(".sc-fill", { scaleX: (i + 1) / n, duration: 0.45 }, i)
      }

      // Отрисовка графиков аналитики при появлении последней сцены
      const drawAt = n - 1 + 0.2
      tl.to(aBars, { scaleY: 1, stagger: 0.05, duration: 0.5, ease: "back.out(1.6)" }, drawAt)
        .to(aLine, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, drawAt)
        .to(aArea, { autoAlpha: 1, yPercent: 0, duration: 0.6 }, drawAt + 0.15)
        .to(aArc, { strokeDashoffset: 0.68, duration: 0.8, ease: "power2.out" }, drawAt + 0.15)
    },
    { scope: root }
  )

  return (
    <section id="showcase" ref={root} className="relative">
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] flex-col justify-center px-6 py-10 lg:py-16"
      >
        <div className="mx-auto mb-6 max-w-2xl text-center lg:mb-12">
          <div className="mb-2 text-sm font-medium uppercase tracking-widest text-brand lg:mb-3">
            Как это работает
          </div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Один экран — <span className="text-gradient-brand">вся работа</span>
          </h2>
          <p className="mt-4 hidden text-lg text-muted lg:block">
            Листайте вниз — и смотрите, что NeiraFlow делает за ваш бизнес.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:gap-14">
          {/* Девайс */}
          <div className="relative order-1 lg:order-2">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-brand/15 blur-[80px]" />
            <DeviceFrame>
              {SCENES.map((s) => (
                <div key={s.id} data-scene className="absolute inset-0">
                  {s.render}
                </div>
              ))}
            </DeviceFrame>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.06] lg:mt-5">
              <div className="sc-fill h-full origin-left rounded-full bg-gradient-to-r from-brand to-cyan" />
            </div>
          </div>

          {/* Копирайт сцены */}
          <div className="relative order-2 min-h-[96px] sm:min-h-[150px] lg:order-1 lg:min-h-[420px]">
            {SCENES.map((s) => (
              <div key={s.id} data-copy className="absolute inset-0 flex flex-col justify-center">
                <CopyBlock s={s} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
