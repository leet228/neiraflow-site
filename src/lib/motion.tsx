"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

// Регистрируем плагины один раз, только в браузере.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

export { gsap, ScrollTrigger, useGSAP }

export const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

type Dir = "up" | "down" | "left" | "right"

function offset(dir: Dir, d: number) {
  switch (dir) {
    case "up":
      return { y: d }
    case "down":
      return { y: -d }
    case "left":
      return { x: d }
    case "right":
      return { x: -d }
  }
}

/**
 * Появление блока при попадании в зону видимости.
 * На IntersectionObserver — он смотрит на реальную видимость элемента и срабатывает
 * надёжно даже после закреплённых (pin) секций, в отличие от scroll-расчётов.
 */
export function Reveal({
  children,
  className,
  from = "up",
  distance = 28,
  delay = 0,
  duration = 0.8,
}: {
  children: React.ReactNode
  className?: string
  from?: Dir
  distance?: number
  delay?: number
  duration?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (reduced()) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }
      gsap.set(el, { autoAlpha: 0, ...offset(from, distance) })
      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              gsap.to(el, { autoAlpha: 1, x: 0, y: 0, duration, delay, ease: "power3.out" })
              obs.disconnect()
              break
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      )
      io.observe(el)
      return () => io.disconnect()
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** Каскадное появление прямых детей контейнера (для сеток и списков). */
export function Stagger({
  children,
  className,
  from = "up",
  distance = 28,
  stagger = 0.1,
  duration = 0.7,
}: {
  children: React.ReactNode
  className?: string
  from?: Dir
  distance?: number
  stagger?: number
  duration?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const items = gsap.utils.toArray<HTMLElement>(el.children)
      if (!items.length) return
      if (reduced()) {
        gsap.set(items, { autoAlpha: 1 })
        return
      }
      gsap.set(items, { autoAlpha: 0, ...offset(from, distance) })
      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              gsap.to(items, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration,
                ease: "power3.out",
                stagger,
              })
              obs.disconnect()
              break
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
      )
      io.observe(el)
      return () => io.disconnect()
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
