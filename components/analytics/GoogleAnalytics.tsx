"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
} from "@/components/common/CookieConsent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics, gated behind cookie consent (RGPD/ePrivacy). The GA
 * scripts only mount once the user has explicitly accepted — they never
 * fire on first load or if the user rejects. Reacts live to the consent
 * banner via the COOKIE_CONSENT_EVENT custom event.
 */
export function GoogleAnalytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    try {
      setAccepted(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
    } catch {
      setAccepted(false);
    }
    const onChange = (e: Event) => {
      setAccepted((e as CustomEvent).detail === "accepted");
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  if (!GA_MEASUREMENT_ID || !accepted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
