// app/api/chat/route.ts
// API route para Hera — agente IA de 107 Studio
// Dev/Preview: Gemini 2.5 Flash (gratis)
// Producción: Claude Sonnet (Anthropic)

import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { buildHeraPrompt } from "@/lib/hera-prompt"

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const WEBHOOK_URL =
  "https://qqqrcarjphixlvskvpto.supabase.co/functions/v1/hera-webhook"

const RESEND_API_URL = "https://api.resend.com/emails"
const NOTIFICATION_EMAIL = "hola@107studio.es"

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 20
const MAX_MESSAGES = 50

// ─────────────────────────────────────────────
// Rate limiting en memoria (básico, suficiente para widget)
// ─────────────────────────────────────────────

const rateLimit = new Map<string, { count: number; resetAt: number }>()

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
// Model selection
// ─────────────────────────────────────────────

function getModel() {
  const isProduction = process.env.NODE_ENV === "production"
    && process.env.VERCEL_ENV === "production"

  if (isProduction && process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-20250514")
  }

  return google("gemini-2.5-flash")
}

// ─────────────────────────────────────────────
// Lead data extraction from messages
// ─────────────────────────────────────────────

interface LeadData {
  name?: string
  email?: string
  phone?: string
  company?: string
  interest?: string
  budget?: string
  summary?: string
}

function extractLeadData(messages: Array<{ role: string; content: string }>): LeadData | null {
  for (const msg of messages) {
    const match = msg.content.match(/<LEAD_DATA>([\s\S]*?)<\/LEAD_DATA>/)
    if (match) {
      try {
        const parsed = JSON.parse(match[1]) as LeadData
        if (parsed && typeof parsed === "object") return parsed
      } catch {
        // Try key:value fallback parsing
        const data: LeadData = {}
        const lines = match[1].trim().split("\n")
        for (const line of lines) {
          const [key, ...rest] = line.split(":")
          const value = rest.join(":").trim()
          if (key && value) {
            const k = key.trim().toLowerCase() as keyof LeadData
            if (["name", "email", "phone", "company", "interest", "budget", "summary"].includes(k)) {
              data[k] = value
            }
          }
        }
        if (Object.keys(data).length > 0) return data
      }
    }
  }
  return null
}

// ─────────────────────────────────────────────
// Webhook — send conversation to Supabase
// ─────────────────────────────────────────────

async function sendToWebhook(payload: {
  session_id: string
  messages: Array<{ role: string; content: string }>
  lead_data: LeadData | null
  source_url?: string
  source_lang?: string
  user_agent?: string
  status: string
}) {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch {
    // Non-blocking — don't fail the chat if webhook is down
  }
}

// ─────────────────────────────────────────────
// Email notification — notify team of new leads
// ─────────────────────────────────────────────

async function sendLeadNotification(
  leadData: LeadData,
  sessionId: string,
  sourceUrl?: string,
) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const fields = [
    leadData.name && `<strong>Nombre:</strong> ${leadData.name}`,
    leadData.email && `<strong>Email:</strong> ${leadData.email}`,
    leadData.phone && `<strong>Teléfono:</strong> ${leadData.phone}`,
    leadData.company && `<strong>Empresa:</strong> ${leadData.company}`,
    leadData.interest && `<strong>Interés:</strong> ${leadData.interest}`,
    leadData.budget && `<strong>Presupuesto:</strong> ${leadData.budget}`,
    leadData.summary && `<strong>Resumen:</strong> ${leadData.summary}`,
  ].filter(Boolean)

  const html = `
    <div style="font-family: sans-serif; max-width: 520px;">
      <h2 style="margin: 0 0 16px; font-size: 18px;">Nuevo lead desde Hera</h2>
      ${fields.map((f) => `<p style="margin: 4px 0;">${f}</p>`).join("")}
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
      <p style="margin: 4px 0; color: #888; font-size: 13px;">Sesión: ${sessionId}</p>
      ${sourceUrl ? `<p style="margin: 4px 0; color: #888; font-size: 13px;">Página: ${sourceUrl}</p>` : ""}
    </div>
  `

  try {
    await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Hera <hera@107studio.es>",
        to: [NOTIFICATION_EMAIL],
        subject: `Nuevo lead: ${leadData.name || leadData.email || "Sin identificar"}`,
        html,
      }),
    })
  } catch {
    // Non-blocking — don't fail the chat if email fails
  }
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

    const body = (await req.json()) as {
      messages: Array<UIMessage>
      sessionId?: string
      sourceUrl?: string
      sourceLang?: string
      userAgent?: string
    }

    const { messages, sessionId, sourceUrl, sourceLang, userAgent } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Mensajes no válidos." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    const trimmedMessages = messages.slice(-MAX_MESSAGES)

    const result = streamText({
      model: getModel(),
      system: buildHeraPrompt(),
      messages: await convertToModelMessages(trimmedMessages),
      maxOutputTokens: 1024,
      temperature: 0.7,
      async onFinish({ text }) {
        // Build flat messages array for the webhook
        const flatMessages: Array<{ role: string; content: string }> = []

        for (const msg of trimmedMessages) {
          const textContent = msg.parts
            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("") ?? ""

          if (textContent) {
            flatMessages.push({ role: msg.role, content: textContent })
          }
        }

        // Add the assistant response that just finished
        if (text) {
          flatMessages.push({ role: "assistant", content: text })
        }

        // Extract lead data from all messages
        const leadData = extractLeadData(flatMessages)

        const resolvedSessionId = sessionId ?? `anon-${ip}-${Date.now()}`

        // Send to Supabase webhook (non-blocking)
        sendToWebhook({
          session_id: resolvedSessionId,
          messages: flatMessages,
          lead_data: leadData,
          source_url: sourceUrl,
          source_lang: sourceLang ?? "es",
          user_agent: userAgent,
          status: leadData ? "new" : "new",
        })

        // Email notification when lead data is captured
        if (leadData) {
          sendLeadNotification(leadData, resolvedSessionId, sourceUrl)
        }
      },
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
