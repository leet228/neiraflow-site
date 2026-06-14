"use client"

import { useGSAP, ScrollTrigger } from "@/lib/motion"

/**
 * Пересчитывает позиции всех ScrollTrigger после монтирования секций.
 * Нужно из-за закреплённого showcase: он меняет высоту страницы, и триггеры
 * ниже по странице должны узнать свои правильные start/end.
 */
export function ScrollSetup() {
  useGSAP(() => {
    ScrollTrigger.refresh()
    // повторный refresh после подгрузки шрифтов/раскладки
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(t)
  })
  return null
}
