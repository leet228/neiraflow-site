import { PricingSection, type PricingPlan } from "@/components/ui/pricing"

const plans: PricingPlan[] = [
  {
    name: "Старт",
    price: 7900,
    yearlyPrice: 6320,
    period: "мес",
    description: "Для небольшого бизнеса",
    features: ["1 автоматизация на выбор", "1 канал связи", "Базовая аналитика", "Поддержка в чате"],
    buttonText: "Оставить заявку",
    href: "#lead",
  },
  {
    name: "Бизнес",
    price: 24900,
    yearlyPrice: 19920,
    period: "мес",
    description: "Для растущего бизнеса",
    features: [
      "До 3 автоматизаций",
      "Все каналы связи",
      "CRM-воронка заявок",
      "Расширенная аналитика",
      "Приоритетная поддержка",
    ],
    buttonText: "Оставить заявку",
    href: "#lead",
    isPopular: true,
  },
  {
    name: "Премиум",
    price: null,
    priceText: "Индивидуально",
    priceTextShort: "По запросу",
    period: "мес",
    description: "Под ключ и интеграции",
    features: [
      "Автоматизации без лимита",
      "Кастомные интеграции",
      "Голосовой ассистент",
      "Выделенный менеджер",
      "SLA и приоритет",
    ],
    buttonText: "Обсудить проект",
    href: "#lead",
  },
]

export function Pricing() {
  return (
    <PricingSection
      id="pricing"
      plans={plans}
      title={
        <>
          Прозрачная <span className="text-gradient-brand">подписка</span>
        </>
      }
      description="Без скрытых платежей. Платите помесячно или сэкономьте 20% на годовой оплате."
    />
  )
}
