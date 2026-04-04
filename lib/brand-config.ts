// lib/brand-config.ts
// Configuración multi-marca para el chatbot

export interface BrandTheme {
  base: string
  baseOpp: string
  accent: string
}

export interface BrandConfig {
  slug: string
  assistantName: string
  avatarLetter: string
  studioName: string
  webhookUrl: string
  notificationEmail: string
  emailFrom: string
  accentColor: string
  theme: BrandTheme
  allowedOrigins: string[]
}

const BRANDS: Record<string, BrandConfig> = {
  "107": {
    slug: "107",
    assistantName: "Hera",
    avatarLetter: "H",
    studioName: "107 Studio",
    webhookUrl:
      "https://qqqrcarjphixlvskvpto.supabase.co/functions/v1/hera-webhook",
    notificationEmail: "hola@107studio.es",
    emailFrom: "Hera <hera@107studio.es>",
    accentColor: "#ddf160",
    theme: { base: "#161616", baseOpp: "#faf7f6", accent: "#ddf160" },
    allowedOrigins: ["https://107studio.es", "https://www.107studio.es"],
  },
  "086": {
    slug: "086",
    assistantName: "Hera",
    avatarLetter: "H",
    studioName: "086 Studio",
    webhookUrl:
      "https://qqqrcarjphixlvskvpto.supabase.co/functions/v1/hera-webhook",
    notificationEmail: "hola@107studio.es", // TODO: cambiar al email de 086
    emailFrom: "Hera <hera@107studio.es>", // TODO: cambiar cuando 086 tenga dominio verificado en Resend
    accentColor: "#ddf160",
    theme: { base: "#ffffff", baseOpp: "#1a1a1a", accent: "#ddf160" },
    allowedOrigins: [
      "https://complex-course-181291.framer.app",
      "http://localhost:3000",
    ],
  },
  hera: {
    slug: "hera",
    assistantName: "Hera",
    avatarLetter: "H",
    studioName: "Tu asistente virtual",
    webhookUrl:
      "https://qqqrcarjphixlvskvpto.supabase.co/functions/v1/hera-webhook",
    notificationEmail: "hola@107studio.es",
    emailFrom: "Hera <hera@107studio.es>",
    accentColor: "#ddf160",
    theme: { base: "#ffffff", baseOpp: "#1a1a1a", accent: "#6366f1" },
    allowedOrigins: [
      "https://saas-landing-eight-theta.vercel.app",
      "http://localhost:5173",
    ],
  },
}

export function getBrand(slug?: string): BrandConfig {
  return BRANDS[slug ?? "107"] ?? BRANDS["107"]
}

export function isAllowedOrigin(
  origin: string | null,
  brand: BrandConfig,
): boolean {
  if (!origin) return false
  return brand.allowedOrigins.some(
    (allowed) => origin === allowed || origin.endsWith(".framer.app"),
  )
}
