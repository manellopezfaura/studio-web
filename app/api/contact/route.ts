// app/api/contact/route.ts
// Endpoint único para los dos formularios de contacto (página /contact y
// footer). Entrega vía Resend a hola@107studio.es — sin terceros.
// Sustituye a Web3Forms (key ligada a un buzón inexistente) y Formspree.

import { contactSchema } from "@/schemas/contact";

const RESEND_API_URL = "https://api.resend.com/emails";
const TO_EMAIL = "hola@107studio.es";
const FROM_EMAIL = "Web 107 Studio <web@107studio.es>";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const rateLimit = new Map<string, { count: number; resetAt: number }>();

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

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "Email service not configured" },
      { status: 500 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: campo oculto que los humanos dejan vacío. Si llega relleno es
  // un bot — respondemos ok para no darle pistas, pero no enviamos nada.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    (body as Record<string, unknown>).website
  ) {
    return Response.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed" },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.Message.length > 5000 || data.Name.length > 200) {
    return Response.json({ ok: false, error: "Too long" }, { status: 400 });
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
      <h2 style="margin: 0 0 16px; font-size: 18px;">Nuevo mensaje desde 107studio.es</h2>
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
        subject: `Contacto web: ${data.Name}`,
        html,
      }),
    });

    if (!res.ok) {
      return Response.json(
        { ok: false, error: "Email delivery failed" },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "Email delivery failed" },
      { status: 502 },
    );
  }
}
