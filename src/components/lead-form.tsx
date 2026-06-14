"use client"

import * as React from "react"
import { ArrowRight, Check, Loader2, Sparkles, Send, Mail } from "lucide-react"
import { Reveal } from "@/lib/motion"
import { buttonVariants } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const benefits = [
  "Бесплатный разбор вашего бизнеса",
  "Покажем, что можно автоматизировать",
  "Расчёт стоимости и сроков",
]

const spheres = [
  "Барбершоп / салон красоты",
  "Клиника / медицина",
  "Ресторан / кафе",
  "Магазин / e-commerce",
  "Фитнес / спорт",
  "Образование / курсы",
  "Услуги / сервис",
  "Авто",
  "Недвижимость",
]

type State = "idle" | "loading" | "success" | "error"
type Channel = "telegram" | "email"

export function LeadForm() {
  const [state, setState] = React.useState<State>("idle")
  const [channel, setChannel] = React.useState<Channel>("telegram")
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    contact: "",
    sphere: "",
    message: "",
  })

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || state === "loading") return
    setState("loading")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, channel }),
      })
      setState(res.ok ? "success" : "error")
    } catch {
      setState("error")
    }
  }

  const field =
    "w-full rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-brand/60 focus:bg-white/[0.05]"

  return (
    <section id="lead" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[150px]" />
      <Reveal className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <div className="lg:pt-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-sm text-muted">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Ответим в течение дня
          </div>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Оставьте <span className="text-gradient-brand">заявку</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Расскажите про бизнес — предложим, что автоматизировать в первую очередь.
          </p>
          <ul className="mt-7 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-fg/85">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-brand">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="card-premium rounded-2xl p-6 sm:p-8">
          {state === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 text-brand">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold">Заявка отправлена!</h3>
              <p className="mt-2 text-muted">Свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-muted">Как вас зовут?</label>
                <input className={field} placeholder="Иван" value={form.name} onChange={set("name")} required />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted">Телефон</label>
                <input
                  className={field}
                  type="tel"
                  inputMode="tel"
                  placeholder="+7 999 123-45-67"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted">Куда ещё с вами связаться?</label>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-white/[0.02] p-1">
                  {(
                    [
                      { id: "telegram", label: "Telegram", icon: Send },
                      { id: "email", label: "Почта", icon: Mail },
                    ] as const
                  ).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChannel(c.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors",
                        channel === c.id
                          ? "bg-brand text-bg"
                          : "text-muted hover:text-fg"
                      )}
                    >
                      <c.icon className="h-4 w-4" />
                      {c.label}
                    </button>
                  ))}
                </div>
                <input
                  className={field}
                  type={channel === "email" ? "email" : "text"}
                  placeholder={channel === "email" ? "you@example.com" : "@username"}
                  value={form.contact}
                  onChange={set("contact")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted">Сфера бизнеса</label>
                <Select
                  options={spheres}
                  value={form.sphere}
                  onChange={(v) => setForm((f) => ({ ...f, sphere: v }))}
                  placeholder="Выберите сферу"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-muted">
                  Что хотите автоматизировать? <span className="text-faint">(необязательно)</span>
                </label>
                <textarea
                  className={cn(field, "min-h-[80px] resize-none")}
                  placeholder="Например: запись клиентов и ответы в Instagram"
                  value={form.message}
                  onChange={set("message")}
                />
              </div>

              {state === "error" && (
                <p className="text-sm text-fg/70">
                  Не удалось отправить. Попробуйте ещё раз.
                </p>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className={cn(buttonVariants({ variant: "brand", size: "lg" }), "group w-full")}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Отправляем…
                  </>
                ) : (
                  <>
                    Отправить заявку
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-faint">
                Нажимая кнопку, вы соглашаетесь на обработку данных
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  )
}
