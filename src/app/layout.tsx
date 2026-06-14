import type { Metadata, Viewport } from "next"
import { Unbounded, Manrope } from "next/font/google"
import "./globals.css"

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  weight: ["500", "600", "700", "800"],
  display: "swap",
})

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NeiraFlow — AI-автоматизации для бизнеса",
  description:
    "Чат-боты, запись клиентов, обработка лидов и документов на искусственном интеллекте. Подключаем автоматизации вашему бизнесу под ключ.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d12",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
