// app/api/chat/[brand]/route.ts
// API route para chatbot multi-marca
// Dev/Preview: Gemini 2.5 Flash (gratis)
// Producción: Claude Sonnet (Anthropic)

import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { getBrand, isAllowedOrigin } from "@/lib/brand-config"
import { buildChatPrompt } from "@/lib/hera-prompt"
import { buildBookingTools } from "@/lib/booking-tools"

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const RESEND_API_URL = "https://api.resend.com/emails"

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 20
const MAX_MESSAGES = 50
const STREAM_TIMEOUT_MS = 30_000

// ─────────────────────────────────────────────
// CORS helpers
// ─────────────────────────────────────────────

function corsHeaders(origin: string | null, brandSlug: string) {
  const brand = getBrand(brandSlug)
  const allowed = isAllowedOrigin(origin, brand)

  return {
    "Access-Control-Allow-Origin": allowed && origin ? origin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  }
}

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

function getModels() {
  const isProduction = process.env.NODE_ENV === "production"
    && process.env.VERCEL_ENV === "production"

  // Anthropic primario en producción, Gemini como fallback
  if (isProduction && process.env.ANTHROPIC_API_KEY) {
    return [anthropic("claude-sonnet-4-20250514"), google("gemini-2.5-flash")]
  }

  return [google("gemini-2.5-flash")]
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
// HMAC signing for webhook requests
// ─────────────────────────────────────────────

async function signPayload(body: string): Promise<string> {
  const secret = process.env.WEBHOOK_SECRET?.trim()
  if (!secret) return ""
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// ─────────────────────────────────────────────
// Webhook — send conversation to Supabase
// ─────────────────────────────────────────────

async function sendToWebhook(webhookUrl: string, payload: {
  session_id: string
  messages: Array<{ role: string; content: string }>
  lead_data: LeadData | null
  source_url?: string
  source_lang?: string
  user_agent?: string
  brand?: string
  status: string
}) {
  try {
    const body = JSON.stringify(payload)
    const signature = await signPayload(body)
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
      },
      body,
    })
  } catch {
    // Non-blocking
  }
}

// ─────────────────────────────────────────────
// Email notification — notify team of new leads
// ─────────────────────────────────────────────

async function sendLeadNotification(
  leadData: LeadData,
  sessionId: string,
  emailFrom: string,
  notificationEmail: string,
  studioName: string,
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
      <h2 style="margin: 0 0 16px; font-size: 18px;">Nuevo lead desde Hera — ${studioName}</h2>
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
        from: emailFrom,
        to: [notificationEmail],
        subject: `Nuevo lead: ${leadData.name || leadData.email || "Sin identificar"}`,
        html,
      }),
    })
  } catch {
    // Non-blocking
  }
}

// ─────────────────────────────────────────────
// Usage tracking — log every request per brand
// ─────────────────────────────────────────────

async function logUsage(webhookUrl: string, payload: {
  brand: string
  session_id: string
  message_count: number
  timestamp: string
  source_url?: string
  ip_hash: string
}) {
  try {
    const body = JSON.stringify({ ...payload, type: "usage" })
    const signature = await signPayload(body)
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
      },
      body,
    })
  } catch {
    // Non-blocking
  }
}

function hashIp(ip: string): string {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash + ip.charCodeAt(i)) | 0
  }
  return Math.abs(hash).toString(36)
}

// ─────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────

export async function OPTIONS(
  req: Request,
  { params }: { params: Promise<{ brand: string }> },
) {
  const { brand: brandSlug } = await params
  const origin = req.headers.get("origin")
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, brandSlug),
  })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ brand: string }> },
) {
  const { brand: brandSlug } = await params
  const origin = req.headers.get("origin")
  const cors = corsHeaders(origin, brandSlug)
  const brand = getBrand(brandSlug)

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas peticiones. Espera un momento." }),
        { status: 429, headers: { "Content-Type": "application/json", ...cors } },
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
        { status: 400, headers: { "Content-Type": "application/json", ...cors } },
      )
    }

    // Log usage (non-blocking) — count 1 per request, not total history
    logUsage(brand.webhookUrl, {
      brand: brand.slug,
      session_id: sessionId ?? `anon-${ip}-${Date.now()}`,
      message_count: 1,
      timestamp: new Date().toISOString(),
      source_url: sourceUrl,
      ip_hash: hashIp(ip),
    })

    const trimmedMessages = messages.slice(-MAX_MESSAGES)
    const convertedMessages = await convertToModelMessages(trimmedMessages)
    const systemPrompt = buildChatPrompt(brand)
    const models = getModels()
    const bookingTools = buildBookingTools(brand)

    const onFinish = async ({ text }: { text: string }) => {
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

      if (text) {
        flatMessages.push({ role: "assistant", content: text })
      }

      const leadData = extractLeadData(flatMessages)
      const resolvedSessionId = sessionId ?? `anon-${ip}-${Date.now()}`

      sendToWebhook(brand.webhookUrl, {
        session_id: resolvedSessionId,
        messages: flatMessages,
        lead_data: leadData,
        source_url: sourceUrl,
        source_lang: sourceLang ?? "es",
        user_agent: userAgent,
        brand: brand.slug,
        status: "new",
      })

      if (leadData) {
        sendLeadNotification(
          leadData,
          resolvedSessionId,
          brand.emailFrom,
          brand.notificationEmail,
          brand.studioName,
          sourceUrl,
        )
      }
    }

    // Try each model, fallback on failure
    let lastError: unknown = null
    for (let i = 0; i < models.length; i++) {
      const model = models[i]
      const isLastModel = i === models.length - 1
      try {
        const abortController = new AbortController()
        const timeout = setTimeout(
          () => abortController.abort(),
          STREAM_TIMEOUT_MS,
        )

        const result = streamText({
          model,
          system: systemPrompt,
          messages: convertedMessages,
          maxOutputTokens: 1024,
          temperature: 0.7,
          abortSignal: abortController.signal,
          ...(bookingTools && {
            tools: bookingTools,
            maxSteps: 5,
          }),
          onChunk: () => {
            clearTimeout(timeout)
          },
          onFinish: async ({ text }) => {
            await onFinish({ text })
          },
        })

        // For non-last models, verify the stream works before returning
        if (!isLastModel) {
          try {
            await result.usage
          } catch {
            clearTimeout(timeout)
            continue // fallback to next model
          }
        }

        const response = result.toUIMessageStreamResponse()

        const newHeaders = new Headers(response.headers)
        for (const [key, value] of Object.entries(cors)) {
          newHeaders.set(key, value)
        }

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        })
      } catch (e) {
        lastError = e
        // If not last model, continue to fallback
      }
    }

    // All models failed
    throw lastError
  } catch (error: unknown) {
    const isAbort =
      error instanceof Error && error.name === "AbortError"
    const message = isAbort
      ? "El servicio tardó demasiado en responder. Inténtalo de nuevo."
      : error instanceof Error
        ? error.message
        : "Error interno del servidor"

    return new Response(
      JSON.stringify({ error: message }),
      { status: isAbort ? 504 : 500, headers: { "Content-Type": "application/json", ...cors } },
    )
  }
}
