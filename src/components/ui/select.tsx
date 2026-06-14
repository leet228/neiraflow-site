"use client"

import * as React from "react"
import { ChevronDown, Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function Select({
  options,
  value,
  onChange,
  placeholder = "Выберите…",
  customLabel = "Другое…",
  customPlaceholder = "Впишите свою сферу",
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  customLabel?: string
  customPlaceholder?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [customMode, setCustomMode] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isPreset = options.includes(value)

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setCustomMode(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        setCustomMode(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  React.useEffect(() => {
    if (customMode) inputRef.current?.focus()
  }, [customMode])

  const toggle = () => {
    setOpen((o) => {
      const next = !o
      if (next && value && !isPreset) setCustomMode(true)
      return next
    })
  }

  const pick = (opt: string) => {
    onChange(opt)
    setOpen(false)
    setCustomMode(false)
  }

  const startCustom = () => {
    setCustomMode(true)
    if (isPreset) onChange("")
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border bg-white/[0.03] px-4 py-3 text-left text-sm transition-colors",
          open ? "border-brand/60 bg-white/[0.05]" : "border-border hover:border-white/20"
        )}
      >
        <span className={value ? "text-fg" : "text-faint"}>{value || placeholder}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-faint transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-bg-soft shadow-2xl ring-1 ring-white/5 animate-in fade-in-0 slide-in-from-top-1 duration-150">
          <div className="max-h-64 overflow-auto p-1.5">
            {options.map((opt) => {
              const active = value === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => pick(opt)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    active ? "bg-brand/15 text-brand" : "text-fg/85 hover:bg-white/5"
                  )}
                >
                  {opt}
                  {active && <Check className="h-4 w-4" />}
                </button>
              )
            })}

            <div className="my-1 h-px bg-border" />

            {!customMode ? (
              <button
                type="button"
                onClick={startCustom}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  value && !isPreset ? "text-brand" : "text-faint hover:bg-white/5 hover:text-fg"
                )}
              >
                <Plus className="h-4 w-4" />
                {value && !isPreset ? value : customLabel}
              </button>
            ) : (
              <div className="p-1">
                <input
                  ref={inputRef}
                  value={isPreset ? "" : value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      setOpen(false)
                    }
                  }}
                  placeholder={customPlaceholder}
                  className="w-full rounded-lg border border-brand/50 bg-white/[0.05] px-3 py-2 text-sm text-fg outline-none placeholder:text-faint"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
