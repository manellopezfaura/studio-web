import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Webhook-Signature",
}

const KNOWN_BRANDS = ["107", "086", "hera"]

// ── HMAC verification ──
async function verifySignature(body: string, signature: string | null): Promise<boolean> {
  const secret = Deno.env.get("WEBHOOK_SECRET")
  if (!secret) return false // reject if secret not configured
  if (!signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body))
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return expected === signature
}

// ── Payload validation ──
function validateUsagePayload(p: Record<string, unknown>): string | null {
  if (typeof p.brand !== "string" || !KNOWN_BRANDS.includes(p.brand)) return "invalid brand"
  if (typeof p.session_id !== "string" || p.session_id.length === 0) return "missing session_id"
  if (typeof p.message_count !== "number" || p.message_count < 0) return "invalid message_count"
  return null
}

function validateConversationPayload(p: Record<string, unknown>): string | null {
  if (typeof p.session_id !== "string" || p.session_id.length === 0) return "missing session_id"
  if (typeof p.brand !== "string" || !KNOWN_BRANDS.includes(p.brand as string)) return "invalid brand"
  if (!Array.isArray(p.messages)) return "messages must be array"
  if (p.messages.length > 200) return "too many messages"
  return null
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    // ── Read body once for signature verification ──
    const bodyText = await req.text()

    // ── Verify HMAC signature ──
    const signature = req.headers.get("x-webhook-signature")
    const valid = await verifySignature(bodyText, signature)
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    // ── Size check (max 512KB) ──
    if (bodyText.length > 512 * 1024) {
      return new Response(
        JSON.stringify({ error: "Payload too large" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const payload = JSON.parse(bodyText)

    // ── Usage tracking ──
    if (payload.type === "usage") {
      const validationError = validateUsagePayload(payload)
      if (validationError) {
        return new Response(
          JSON.stringify({ error: validationError }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
      }

      const { error } = await supabase.from("hera_usage").insert({
        brand: payload.brand,
        session_id: payload.session_id,
        message_count: payload.message_count ?? 0,
        source_url: payload.source_url,
        ip_hash: payload.ip_hash,
      })

      if (error) throw error

      return new Response(
        JSON.stringify({ ok: true, type: "usage" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    // ── Conversation webhook ──
    const validationError = validateConversationPayload(payload)
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    const { session_id, messages, lead_data, source_url, source_lang, user_agent, brand, status } = payload

    const { error } = await supabase.from("hera_conversations").upsert(
      {
        session_id,
        brand: brand ?? "107",
        messages,
        lead_data,
        source_url,
        source_lang,
        user_agent,
        status: status ?? "new",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" },
    )

    if (error) throw error

    return new Response(
      JSON.stringify({ ok: true, type: "conversation" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})
