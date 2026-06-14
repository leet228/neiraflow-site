import { Reveal, Stagger } from "@/lib/motion"
import { GridBackground } from "@/components/ui/grid-hero-animated"

const steps = [
  {
    n: "01",
    title: "Заявка и разбор",
    desc: "Оставляете заявку. Созваниваемся, разбираем задачи и процессы вашего бизнеса.",
  },
  {
    n: "02",
    title: "Настройка под вас",
    desc: "Собираем и обучаем автоматизации под ваши сценарии, тексты и интеграции.",
  },
  {
    n: "03",
    title: "Запуск и поддержка",
    desc: "Запускаем за 1–2 недели и сопровождаем — улучшаем на реальных данных.",
  },
]

export function How() {
  return (
    <section id="how" className="relative overflow-hidden px-6 py-24 sm:py-32">
      {/* Фон: анимированная сетка с бегущими частицами */}
      <GridBackground className="opacity-90 [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)]" />

      <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
          Как мы работаем
        </div>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          От заявки до запуска — <span className="text-gradient-brand">2 недели</span>
        </h2>
      </Reveal>

      <Stagger className="relative z-10 mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="card-premium relative rounded-2xl p-8">
            <div className="font-display text-5xl font-bold text-gradient-brand">{s.n}</div>
            <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2.5 text-muted">{s.desc}</p>
          </div>
        ))}
      </Stagger>
    </section>
  )
}
