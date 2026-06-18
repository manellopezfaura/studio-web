"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-change";

declare global {
  interface Window {
    // Definida por el script de inicio de GTM en <head> (Consent Mode v2).
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Cookie consent banner. Shown on first visit until the user accepts or
 * rejects. The choice is stored in localStorage, pushed to Google Consent
 * Mode v2 (GTM), and broadcast via a custom event for any other consent-aware
 * code — analytics/ads cookies never fire before consent (RGPD/ePrivacy).
 */
export function CookieConsent() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored !== "accepted" && stored !== "rejected") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  // While the banner is visible on narrow viewports it spans the bottom of the
  // screen and would overlap the Hera chat trigger (bottom-right). Expose its
  // real height + a flag on <html> so the trigger can lift above it (hera.css).
  useEffect(() => {
    if (!visible) return;
    const el = bannerRef.current;
    if (!el) return;
    const root = document.documentElement;
    const syncHeight = () => {
      root.style.setProperty("--cookie-banner-height", `${el.offsetHeight}px`);
    };
    syncHeight();
    root.classList.add("cookie-consent-open");
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.classList.remove("cookie-consent-open");
      root.style.removeProperty("--cookie-banner-height");
    };
  }, [visible]);

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* storage unavailable — banner just won't persist */
    }
    // Refleja la decisión en Google Consent Mode v2 (GTM). Si GTM no está
    // cargado (sin contenedor configurado) es un no-op inofensivo.
    const signal = value === "accepted" ? "granted" : "denied";
    window.gtag?.("consent", "update", {
      ad_storage: signal,
      ad_user_data: signal,
      ad_personalization: signal,
      analytics_storage: signal,
    });
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }),
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-label={t("message")}
    >
      <p className="cookie-banner__text">
        {t("message")}{" "}
        <Link
          href="/cookies"
          className="cookie-banner__link"
          style={{ color: "#ddf160" }}
        >
          {t("more")}
        </Link>
      </p>
      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--ghost"
          onClick={() => decide("rejected")}
        >
          {t("reject")}
        </button>
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--accent"
          onClick={() => decide("accepted")}
        >
          {t("accept")}
        </button>
      </div>

      <style jsx>{`
        .cookie-banner {
          position: fixed;
          left: 50%;
          bottom: 2rem;
          transform: translateX(-50%);
          z-index: 10000;
          width: calc(100% - 4rem);
          max-width: 560px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.2rem 1.6rem;
          padding: 1.6rem 2rem;
          border-radius: 1.4rem;
          background: rgba(14, 15, 14, 0.92);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          backdrop-filter: saturate(180%) blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 40px -8px rgba(0, 0, 0, 0.5);
          color: rgba(255, 255, 255, 0.92);
          animation: cookie-rise 0.4s ease;
        }
        @keyframes cookie-rise {
          from {
            opacity: 0;
            transform: translate(-50%, 16px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        /* The card is always dark in both themes, so text is always light.
           Set it explicitly — a global \`p\`/\`a\` color rule (theme-dependent,
           dark in light mode) would otherwise win over inheritance and make
           the text invisible on the dark card. */
        .cookie-banner__text {
          flex: 1 1 240px;
          margin: 0;
          font-size: 1.4rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.92);
        }
        .cookie-banner__link {
          color: #ddf160;
          text-decoration: underline;
          text-underline-offset: 2px;
          white-space: nowrap;
        }
        .cookie-banner__link:hover {
          color: #ddf160;
        }
        .cookie-banner__actions {
          display: flex;
          gap: 0.8rem;
          flex: 0 0 auto;
        }
        .cookie-banner__btn {
          padding: 0.9rem 1.8rem;
          border-radius: 999px;
          font-size: 1.4rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition:
            background-color 0.2s ease,
            transform 0.2s ease,
            border-color 0.2s ease;
        }
        .cookie-banner__btn--ghost {
          background: transparent;
          border-color: rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.85);
        }
        .cookie-banner__btn--ghost:hover {
          border-color: rgba(255, 255, 255, 0.5);
          color: #fff;
        }
        .cookie-banner__btn--accent {
          background: #ddf160;
          color: #161616;
        }
        .cookie-banner__btn--accent:hover {
          transform: translateY(-1px);
        }
        @media (max-width: 480px) {
          .cookie-banner {
            bottom: 1rem;
            width: calc(100% - 2rem);
            padding: 1.4rem 1.6rem;
          }
          .cookie-banner__actions {
            width: 100%;
          }
          .cookie-banner__btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
