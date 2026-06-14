import * as React from "react"
import {
  MessageSquare,
  CalendarCheck,
  Inbox,
  BarChart3,
  Check,
  Phone,
  Globe,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Рамка «браузера» вокруг экрана ===== */
export function DeviceFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("card-premium relative overflow-hidden rounded-2xl", className)}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        {/* Кнопки-светофор как в окне браузера (единственный цвет на Ч/Б сайте) */}
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-center text-[11px] text-faint">
          app.neiraflow.ru
        </div>
      </div>
      <div className="relative h-[340px] overflow-hidden sm:h-[380px] lg:h-[420px]">{children}</div>
    </div>
  )
}

/* ===== Сцена 1: Чат-бот ===== */
function Bubble({ side, children }: { side: "bot" | "user"; children: React.ReactNode }) {
  return (
    <div className={cn("flex", side === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug",
          side === "user"
            ? "rounded-br-sm bg-brand/20 text-fg"
            : "rounded-bl-sm bg-white/[0.06] text-fg/90"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ChatScene() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-5">
      <Bubble side="bot">Здравствуйте! 👋 Спасибо, что написали. Чем можем помочь?</Bubble>
      <Bubble side="user">Хочу записаться на стрижку завтра</Bubble>
      <Bubble side="bot">Конечно! Завтра свободно в 14:00 и 16:30. Когда удобнее?</Bubble>
      <Bubble side="user">В 14:00</Bubble>
      <Bubble side="bot">Отлично, записали вас на завтра в 14:00 ✂️ Напомним за час!</Bubble>
      <div className="mt-auto flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3.5 py-2 text-sm text-faint">
        Сообщение…
        <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-brand text-bg">
          <MessageSquare className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  )
}

/* ===== Сцена 2: Запись клиентов ===== */
const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const slots = ["10:00", "11:30", "13:00", "14:00", "16:30", "18:00"]

export function BookingScene() {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div className="text-sm font-medium text-fg/90">Онлайн-запись · Барбершоп</div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div
            key={d}
            className={cn(
              "rounded-lg py-2 text-center text-xs",
              i === 2 ? "bg-brand text-bg font-semibold" : "bg-white/[0.04] text-faint"
            )}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((s) => (
          <div
            key={s}
            className={cn(
              "rounded-lg border py-2.5 text-center text-sm",
              s === "14:00"
                ? "border-brand bg-brand/15 text-fg"
                : "border-border bg-white/[0.02] text-muted"
            )}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-bg">
        <Check className="h-4 w-4" /> Подтвердить запись · 14:00
      </div>
    </div>
  )
}

/* ===== Сцена 3: Заявки / лиды ===== */
const leads: { name: string; source: string; icon: LucideIcon; status: string; tone: string }[] = [
  { name: "Анна Кузнецова", source: "Instagram", icon: MessageCircle, status: "Новый", tone: "bg-brand/15 text-brand" },
  { name: "Игорь Петров", source: "Сайт", icon: Globe, status: "В работе", tone: "bg-cyan/15 text-cyan" },
  { name: "Мария Л.", source: "Звонок", icon: Phone, status: "Новый", tone: "bg-brand/15 text-brand" },
  { name: "ООО «Вектор»", source: "Сайт", icon: Globe, status: "Закрыт", tone: "bg-white/10 text-faint" },
]

export function LeadsScene() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-fg/90">Заявки сегодня</div>
        <div className="rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-semibold text-brand">
          12 новых
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {leads.map((l) => (
          <div
            key={l.name}
            className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] px-3 py-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-faint">
              <l.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-fg/90">{l.name}</div>
              <div className="text-[11px] text-faint">{l.source}</div>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", l.tone)}>
              {l.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===== Сцена 4: Аналитика ===== */
const bars = [40, 62, 48, 78, 55, 88, 70]
const kpis = [
  { label: "Заявки", value: "248" },
  { label: "Конверсия", value: "32%" },
  { label: "Выручка", value: "1.2М ₽" },
]

export function AnalyticsScene() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-fg/90">Аналитика за 30 дней</div>
        <div className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[11px] font-medium text-brand">
          ▲ 18%
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-white/[0.02] p-2.5">
            <div className="font-display text-base font-bold text-gradient-brand sm:text-lg">
              {k.value}
            </div>
            <div className="text-[10px] text-faint">{k.label}</div>
          </div>
        ))}
      </div>

      {/* График: линия + область */}
      <div className="relative min-h-0 flex-1 rounded-xl border border-border bg-white/[0.02] p-3">
        <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="an-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="an-area"
            d="M0,86 L43,66 L86,76 L129,46 L172,56 L215,28 L258,38 L300,14 L300,110 L0,110 Z"
            fill="url(#an-fill)"
          />
          <path
            className="an-line"
            d="M0,86 L43,66 L86,76 L129,46 L172,56 L215,28 L258,38 L300,14"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={0}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Столбцы + пончик-конверсия */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="an-bars flex h-[96px] items-end gap-1.5 rounded-xl border border-border bg-white/[0.02] p-3">
          {bars.map((h, i) => (
            <div
              key={i}
              className="an-bar flex-1 rounded-t"
              style={{
                height: `${h}%`,
                background: "linear-gradient(to top, var(--color-brand-deep), var(--color-brand))",
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center rounded-xl border border-border bg-white/[0.02] px-4">
          <div className="relative h-[72px] w-[72px]">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-border)" strokeWidth={3} />
              <circle
                className="an-arc"
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={0.68}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-sm font-bold text-fg">32%</div>
              <div className="text-[9px] text-faint">конверсия</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Метаданные сцен ===== */
export type Scene = {
  id: string
  step: string
  tag: string
  icon: LucideIcon
  title: string
  desc: string
  bullets: string[]
  render: React.ReactNode
}

export const SCENES: Scene[] = [
  {
    id: "chat",
    step: "01",
    tag: "Чат-бот",
    icon: MessageSquare,
    title: "Отвечает клиентам 24/7",
    desc: "AI-бот ведёт переписку как живой менеджер: отвечает на вопросы, консультирует и доводит до заявки — в любом мессенджере.",
    bullets: ["Telegram, WhatsApp, Instagram", "Отвечает за секунды, без выходных", "Передаёт сложное человеку"],
    render: <ChatScene />,
  },
  {
    id: "booking",
    step: "02",
    tag: "Запись клиентов",
    icon: CalendarCheck,
    title: "Записывает и напоминает сам",
    desc: "Клиент выбирает удобное время прямо в чате. Бот бронирует слот, добавляет в календарь и напомнит о визите.",
    bullets: ["Онлайн-запись 24/7", "Автонапоминания за час", "−40% неявок"],
    render: <BookingScene />,
  },
  {
    id: "leads",
    step: "03",
    tag: "Заявки и лиды",
    icon: Inbox,
    title: "Собирает заявки в одном месте",
    desc: "Все обращения с сайта, соцсетей и звонков попадают в одну воронку. Ничего не теряется, каждый лид со статусом.",
    bullets: ["Все каналы в одном окне", "Статусы и напоминания", "Выгрузка и интеграции"],
    render: <LeadsScene />,
  },
  {
    id: "analytics",
    step: "04",
    tag: "Аналитика",
    icon: BarChart3,
    title: "Показывает, что работает",
    desc: "Наглядные отчёты: сколько заявок, какая конверсия и выручка. Видно, какие каналы приносят клиентов.",
    bullets: ["Заявки, конверсия, выручка", "Отчёты в реальном времени", "Понятно без аналитика"],
    render: <AnalyticsScene />,
  },
]
