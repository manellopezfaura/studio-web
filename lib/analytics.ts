// lib/analytics.ts
// Empuja el evento de conversión de lead a dataLayer para que GTM
// (GTM-KKS246HF) lo recoja. Se llama solo en el callback de éxito de los
// formularios de contacto, nunca en el clic ni en validación fallida.
//
// user_data alimenta Enhanced Conversions: GTM lo hashea (SHA-256) en cliente
// y solo lo envía a Google con `ad_user_data` concedido (Consent Mode v2).

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type LeadUserData = {
  email: string;
  phone?: string;
};

export function trackGenerateLead(
  source: "footer" | "contact-page",
  userData: LeadUserData,
) {
  const user_data: Record<string, string> = {
    email: userData.email.trim().toLowerCase(),
  };
  const phone = userData.phone?.trim();
  if (phone) user_data.phone_number = phone;

  window.dataLayer?.push({
    event: "generate_lead",
    form_name: "contacto_107studio",
    form_location: source,
    user_data,
  });
}
