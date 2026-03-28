import { ReactNode } from "react";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import "../public/css/styles.css";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${funnelDisplay.variable} ${funnelSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
