import "../public/css/plugins.min.css";
import "../public/css/main.min.css";
import "../public/css/styles.css";
import "../public/css/overrides.css";
import "@/components/hera/hera.css";

import { ReactNode } from "react";
import { headers } from "next/headers";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { OrganizationSchema } from "@/components/seo/JsonLd";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { routing } from "@/i18n/routing";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-funnel-display",
});

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--font-funnel-sans",
});

const setColorSchemeScript = `
(function() {
  try {
    var scheme = localStorage.getItem('color-scheme') || 'dark';
    document.documentElement.setAttribute('color-scheme', scheme);
  } catch(e) {}
  // Gate GSAP entry-animation initial states (opacity 0 in CSS) to JS-on:
  // without JS the content stays visible instead of hidden forever.
  document.documentElement.classList.add('has-js');
})();
`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  // The [locale] segment param isn't accessible here, so the middleware
  // forwards the pathname and we derive the locale for <html lang>.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const maybeLocale = pathname.split("/")[1];
  const lang = (routing.locales as readonly string[]).includes(maybeLocale)
    ? maybeLocale
    : routing.defaultLocale;

  return (
    <html
      suppressHydrationWarning
      lang={lang}
      className={`no-touch ${funnelDisplay.variable} ${funnelSans.variable}`}
    >
      <head>
        <GoogleTagManager />
        <script dangerouslySetInnerHTML={{ __html: setColorSchemeScript }} />
        <OrganizationSchema />
      </head>
      <body>
        <a href="#mxd-page-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
