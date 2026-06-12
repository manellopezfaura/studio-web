// SEO Configuration for 107 Studio
// Update SITE_URL when deploying to production

export const SITE_URL = "https://107studio.es";

export const seoConfig = {
  siteName: "107 Studio",
  siteUrl: SITE_URL,
  defaultTitle: "107 Studio | Diseño Web, Branding y Automatización IA",
  defaultDescription:
    "Estudio digital especializado en diseño web, branding, product design y automatización con IA. Transformamos ideas en experiencias digitales que generan resultados.",
  defaultImage: "/img/og-image.jpg",
  twitterHandle: "@107studio",
  locale: "es_ES",

  // Contact info for Schema.org
  contact: {
    email: "hola@107studio.es",
    phone: "+34677184699" as string | undefined,
    address: {
      street: "Barcelona", // TODO: Update with real address
      city: "Barcelona",
      region: "Catalunya",
      postalCode: "08000",
      country: "ES",
    },
  },

  // Social profiles for Schema.org
  socialProfiles: [
    "https://linkedin.com/company/107studio",
    "https://instagram.com/107studio",
    "https://twitter.com/107studio",
  ],
};

// Helper to generate canonical URL
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

// Page-specific metadata.
// Titles must NOT include "| 107 Studio" — the layout's title template
// (`%s | 107 Studio`) appends it. Including it here doubles the suffix.
export const pageMetadata = {
  home: {
    title: "Diseño Web, Branding y Automatización IA",
    description:
      "Estudio digital en Barcelona especializado en diseño web, branding, product design y automatización con IA. +70 proyectos completados.",
    canonical: getCanonicalUrl("/"),
  },
  aboutUs: {
    title: "Sobre Nosotros — Agencia Digital Barcelona",
    description:
      "Conoce al equipo de 107 Studio. Somos diseñadores, desarrolladores y estrategas digitales apasionados por crear experiencias que importan.",
    canonical: getCanonicalUrl("/about-us"),
  },
  services: {
    title: "Servicios de Diseño Web, Branding y AI",
    description:
      "Servicios de branding, diseño web, product design, automatización IA y marketing digital. Soluciones integrales para impulsar tu negocio.",
    canonical: getCanonicalUrl("/services"),
  },
  works: {
    title: "Portfolio de Proyectos",
    description:
      "Explora nuestro portfolio de proyectos de diseño web, branding y product design. Casos de éxito de clientes que confiaron en 107 Studio.",
    canonical: getCanonicalUrl("/works-simple"),
  },
  contact: {
    title: "Contacto — Cuéntanos tu proyecto",
    description:
      "¿Tienes un proyecto en mente? Contáctanos y cuéntanos tu idea. Respondemos en menos de 24 horas.",
    canonical: getCanonicalUrl("/contact"),
  },
  projectDetails: {
    title: "Caso de Estudio",
    description:
      "Descubre cómo ayudamos a nuestros clientes a alcanzar sus objetivos digitales con diseño estratégico y desarrollo de calidad.",
    canonical: getCanonicalUrl("/project-details"),
  },
  privacyPolicy: {
    title: "Política de Privacidad",
    description:
      "Política de privacidad de 107 Studio. Información sobre cómo tratamos y protegemos tus datos personales.",
    canonical: getCanonicalUrl("/privacy-policy"),
  },
  terms: {
    title: "Términos y Condiciones",
    description:
      "Términos y condiciones de uso del sitio web de 107 Studio. Información legal sobre nuestros servicios.",
    canonical: getCanonicalUrl("/terms"),
  },
};
