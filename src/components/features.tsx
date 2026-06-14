import {
  MessageSquare,
  CalendarCheck,
  Inbox,
  FileText,
  Mic,
  BarChart3,
  type LucideIcon,
} from "lucide-react"
import { Reveal, Stagger } from "@/lib/motion"
import { GlobeBackground } from "@/components/ui/globe-hero"

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: MessageSquare,
    title: "Чат-боты",
    desc: "Отвечают клиентам в Telegram, WhatsApp и Instagram 24/7 — как живой менеджер.",
  },
  {
    icon: CalendarCheck,
    title: "Онлайн-запись",
    desc: "Клиенты записываются сами прямо в чате, а бот напоминает о визите.",
  },
  {
    icon: Inbox,
    title: "Заявки и CRM",
    desc: "Все обращения с сайта, соцсетей и звонков — в одной воронке. Ничего не теряется.",
  },
  {
    icon: FileText,
    title: "Документы",
    desc: "AI распознаёт и обрабатывает счета, накладные и договоры за секунды.",
  },
  {
    icon: Mic,
    title: "Голосовой ассистент",
    desc: "Принимает звонки, отвечает голосом и оформляет заказы без оператора.",
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    desc: "Понятные отчёты: заявки, конверсия и выручка в реальном времени.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24 sm:py-32">
      {/* Фон: вращающийся глобус */}
      <GlobeBackground className="opacity-80 [mask-image:radial-gradient(60%_60%_at_50%_45%,black,transparent)]" />

      <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
          Возможности
        </div>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Всё, чтобы продавать <span className="text-gradient-brand">больше</span>
        </h2>
        <p className="mt-4 text-lg text-muted">
          Набор готовых AI-автоматизаций. Подключаем то, что нужно именно вашему бизнесу.
        </p>
      </Reveal>

      <Stagger className="relative z-10 mx-auto mt-16 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="card-premium group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/12 text-brand transition-transform duration-300 group-hover:scale-110">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2.5 text-muted">{f.desc}</p>
          </div>
        ))}
      </Stagger>
    </section>
  )
}
