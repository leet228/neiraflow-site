"use client"

import * as React from "react"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const links = [
  { href: "#showcase", label: "Возможности" },
  { href: "#how", label: "Как работает" },
  { href: "#pricing", label: "Тарифы" },
]

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
      style={{ paddingTop: `calc(var(--safe-top) + ${scrolled ? "0.625rem" : "1rem"})` }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]"
            : "border border-transparent"
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-bg shadow-[0_0_22px_-6px_var(--brand-glow)]">
            <Zap className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">NeiraFlow</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#lead" className={buttonVariants({ variant: "brand", size: "sm" })}>
          <span className="hidden sm:inline">Оставить заявку</span>
          <span className="sm:hidden">Заявка</span>
        </a>
      </div>
    </header>
  )
}
