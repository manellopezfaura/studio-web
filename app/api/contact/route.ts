// app/api/contact/route.ts
// Endpoint único para los formularios de contacto. Entrega vía Resend a
// hola@107studio.es — sin terceros. Lo usan:
//  - el sitio 107 (página /contact y footer) — mismo origen
//  - el landing de Hera (saas-landing) — origen distinto, por eso hay CORS

import { contactSchema } from "@/schemas/contact";

const RESEND_API_URL = "https://api.resend.com/emails";
const TO_EMAIL = "hola@107studio.es";
const FROM_EMAIL = "Web 107 Studio <web@107studio.es>";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const rateLimit = new Map<string, { count: number; resetAt: number }>();

// Orígenes permitidos a enviar el formulario de forma cross-origin (el landing
// de Hera). El mismo sitio 107 envía same-origin y no necesita esto.
const ALLOWED_ORIGINS = new Set([
  "https://saas-landing-eight-theta.vercel.app",
  "https://107studio.es",
  "https://www.107studio.es",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  if (origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".vercel.app"))) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
  }
  return { Vary: "Origin" };
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: Request) {
  const cors = corsHeaders(req.headers.get("origin"));
  const json = (data: unknown, status = 200) =>
    Response.json(data, { status, headers: cors });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json({ ok: false, error: "Email service not configured" }, 500);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return json({ ok: false, error: "Too many requests" }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // Honeypot: campo oculto que los humanos dejan vacío. Si llega relleno es
  // un bot — respondemos ok para no darle pistas, pero no enviamos nada.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    (body as Record<string, unknown>).website
  ) {
    return json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "Validation failed" }, 400);
  }

  const data = parsed.data;
  if (data.Message.length > 5000 || data.Name.length > 200) {
    return json({ ok: false, error: "Too long" }, 400);
  }

  const source =
    typeof body === "object" && body !== null && "source" in body
      ? String((body as Record<string, unknown>).source).slice(0, 100)
      : "web";

  const rows = [
    ["Nombre", data.Name],
    ["Email", data["E-mail"]],
    data.Company ? ["Empresa", data.Company] : null,
    data.Phone ? ["Teléfono", data.Phone] : null,
  ].filter((r): r is [string, string] => r !== null);

  const html = `
    <div style="font-family: sans-serif; max-width: 520px;">
      <h2 style="margin: 0 0 16px; font-size: 18px;">Nuevo mensaje desde ${escapeHtml(source)}</h2>
      ${rows
        .map(
          ([label, value]) =>
            `<p style="margin: 4px 0;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`,
        )
        .join("")}
      <p style="margin: 16px 0 4px;"><strong>Mensaje:</strong></p>
      <p style="margin: 4px 0; white-space: pre-wrap;">${escapeHtml(data.Message)}</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
      <p style="margin: 4px 0; color: #888; font-size: 13px;">Origen: ${escapeHtml(source)}</p>
    </div>
  `;

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: [data["E-mail"]],
        subject: `Contacto web (${source}): ${data.Name}`,
        html,
      }),
    });

    if (!res.ok) {
      return json({ ok: false, error: "Email delivery failed" }, 502);
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Email delivery failed" }, 502);
  }
}
