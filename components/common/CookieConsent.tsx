"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-change";

/**
 * Cookie consent banner. Shown on first visit until the user accepts or
 * rejects. The choice is stored in localStorage and broadcast via a custom
 * event so GoogleAnalytics can load (or stay off) accordingly — analytics
 * cookies never fire before consent (RGPD/ePrivacy).
 */
export function CookieConsent() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored !== "accepted" && stored !== "rejected") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* storage unavailable — banner just won't persist */
    }
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }),
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-label={t("message")}
    >
      <p className="cookie-banner__text">
        {t("message")}{" "}
        <Link href="/cookies" className="cookie-banner__link">
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
        .cookie-banner__text {
          flex: 1 1 240px;
          margin: 0;
          font-size: 1.4rem;
          line-height: 1.5;
        }
        .cookie-banner__link {
          color: #ddf160;
          text-decoration: underline;
          text-underline-offset: 2px;
          white-space: nowrap;
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
