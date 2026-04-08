import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const payload = await req.json()

    // ── Usage tracking ──
    if (payload.type === "usage") {
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

    // ── Conversation webhook (existing behavior) ──
    const { session_id, messages, lead_data, source_url, source_lang, user_agent, brand, status } = payload

    // Upsert conversation (update if same session, insert if new)
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
