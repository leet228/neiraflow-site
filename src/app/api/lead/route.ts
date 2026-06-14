export const runtime = "nodejs"

/**
 * Приём заявок с лендинга.
 * Если заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID — заявка прилетает в Telegram.
 * Иначе просто логируется (бэкенд подключим отдельно).
 */
export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => null)
    const name = String(data?.name ?? "").trim()
    const phone = String(data?.phone ?? "").trim()
    if (!name || !phone) {
      return Response.json({ ok: false, error: "name_and_phone_required" }, { status: 400 })
    }

    const channel = data?.channel === "email" ? "email" : "telegram"
    const contact = String(data?.contact ?? "").trim()
    const sphere = String(data?.sphere ?? "").trim()
    const message = String(data?.message ?? "").trim()

    const lead = { name, phone, channel, contact, sphere, message, at: new Date().toISOString() }
    console.log("[lead]", lead)

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (token && chatId) {
      const channelLabel = channel === "email" ? "Почта" : "Telegram"
      const text =
        `🟢 Новая заявка NeiraFlow\n\n` +
        `👤 Имя: ${name}\n` +
        `📞 Телефон: ${phone}\n` +
        `✉️ ${channelLabel}: ${contact || "—"}\n` +
        `🏢 Сфера: ${sphere || "—"}\n` +
        `💬 Запрос: ${message || "—"}`
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      }).catch(() => {})
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 })
  }
}
