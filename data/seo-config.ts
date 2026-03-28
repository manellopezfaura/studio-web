// SEO Configuration for 107 Studio
// Update SITE_URL when deploying to production

export const SITE_URL = "https://107studio.com";

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
    email: "hello@107studio.com",
    phone: undefined as string | undefined, // TODO: Add real phone number
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

// Page-specific metadata
export const pageMetadata = {
  home: {
    title: "107 Studio | Diseño Web, Branding y Automatización IA",
    description:
      "Estudio digital en Barcelona especializado en diseño web, branding, product design y automatización con IA. +70 proyectos completados. Solicita presupuesto gratis.",
    canonical: getCanonicalUrl("/"),
  },
  aboutUs: {
    title: "Sobre Nosotros | 107 Studio - Agencia Digital Barcelona",
    description:
      "Conoce al equipo de 107 Studio. Somos diseñadores, desarrolladores y estrategas digitales apasionados por crear experiencias que importan.",
    canonical: getCanonicalUrl("/about-us"),
  },
  services: {
    title: "Servicios de Diseño Web, Branding y AI | 107 Studio",
    description:
      "Servicios de branding, diseño web, product design, automatización IA y marketing digital. Soluciones integrales para impulsar tu negocio.",
    canonical: getCanonicalUrl("/services"),
  },
  works: {
    title: "Portfolio de Proyectos | 107 Studio",
    description:
      "Explora nuestro portfolio de proyectos de diseño web, branding y product design. Casos de éxito de clientes que confiaron en 107 Studio.",
    canonical: getCanonicalUrl("/works-simple"),
  },
  contact: {
    title: "Contacto | 107 Studio - Solicita Tu Presupuesto",
    description:
      "¿Tienes un proyecto en mente? Contáctanos y cuéntanos tu idea. Respondemos en menos de 24 horas. Presupuesto sin compromiso.",
    canonical: getCanonicalUrl("/contact"),
  },
  projectDetails: {
    title: "Caso de Estudio | 107 Studio",
    description:
      "Descubre cómo ayudamos a nuestros clientes a alcanzar sus objetivos digitales con diseño estratégico y desarrollo de calidad.",
    canonical: getCanonicalUrl("/project-details"),
  },
  privacyPolicy: {
    title: "Política de Privacidad | 107 Studio",
    description:
      "Política de privacidad de 107 Studio. Información sobre cómo tratamos y protegemos tus datos personales.",
    canonical: getCanonicalUrl("/privacy-policy"),
  },
  terms: {
    title: "Términos y Condiciones | 107 Studio",
    description:
      "Términos y condiciones de uso del sitio web de 107 Studio. Información legal sobre nuestros servicios.",
    canonical: getCanonicalUrl("/terms"),
  },
};
