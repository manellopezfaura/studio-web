import "../public/css/plugins.min.css";
import "../public/css/main.min.css";
import "../public/css/styles.css";
import "../public/css/overrides.css";
import "@/components/hera/hera.css";

import { ReactNode } from "react";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { OrganizationSchema } from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      lang="es"
      className={`no-touch ${funnelDisplay.variable} ${funnelSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: setColorSchemeScript }} />
        <OrganizationSchema />
      </head>
      <body>
        <a href="#mxd-page-content" className="skip-to-content">
          Skip to content
        </a>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
