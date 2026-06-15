import { Zap } from "lucide-react"

const links = [
  { href: "#showcase", label: "Возможности" },
  { href: "#how", label: "Как работает" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#lead", label: "Заявка" },
]

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-bg">
              <Zap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">NeiraFlow</span>
          </div>
          <p className="mt-4 text-sm text-muted">
            AI-автоматизации для бизнеса под ключ: чат-боты, запись, заявки, документы и аналитика.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <div className="text-sm font-medium text-fg">Навигация</div>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-fg">Контакты</div>
          <a href="#lead" className="text-sm text-muted transition-colors hover:text-fg">
            Оставить заявку
          </a>
          <a href="mailto:info@neiraflow.tech" className="text-sm text-muted transition-colors hover:text-fg">
            info@neiraflow.tech
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6 text-xs text-faint">
        © 2026 NeiraFlow · AI-автоматизации для бизнеса
      </div>
    </footer>
  )
}
