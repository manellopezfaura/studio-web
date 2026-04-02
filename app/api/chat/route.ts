// app/api/chat/route.ts
// API route para Hera — agente IA de 107 Studio

import { anthropic } from "@ai-sdk/anthropic"
import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { buildHeraPrompt } from "@/lib/hera-prompt"

// ─────────────────────────────────────────────
// Rate limiting en memoria (básico, suficiente para widget)
// ─────────────────────────────────────────────

const rateLimit = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minuto
const RATE_LIMIT_MAX = 20 // 20 mensajes por minuto por IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// Limpieza periódica para no leakear memoria
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const now = Date.now()
    for (const [ip, entry] of rateLimit) {
      if (now > entry.resetAt) rateLimit.delete(ip)
    }
  }
  setInterval(cleanup, RATE_LIMIT_WINDOW_MS)
}

// ─────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas peticiones. Espera un momento." }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      )
    }

    const { messages } = (await req.json()) as {
      messages: Array<UIMessage>
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Mensajes no válidos." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // Limitar historial para no exceder context window
    const MAX_MESSAGES = 50
    const trimmedMessages = messages.slice(-MAX_MESSAGES)

    const result = streamText({
      model: anthropic(
        process.env.NODE_ENV === "production"
          ? "claude-sonnet-4-20250514"
          : "claude-haiku-3-5-20241022",
      ),
      system: buildHeraPrompt(),
      messages: await convertToModelMessages(trimmedMessages),
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor"

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
