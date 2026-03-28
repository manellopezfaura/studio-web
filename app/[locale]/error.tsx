"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="mxd-page-content" className="mxd-page-content">
      <div className="mxd-section mxd-section-fullscreen">
        <div className="mxd-container grid-container fullwidth-container fullscreen-container">
          <div className="mxd-block fullscreen-block">
            <div className="mxd-error-page">

              {/* Glitch code */}
              <p
                className="mxd-error-page__code"
                data-text="500"
                aria-hidden="true"
              >500</p>

              {/* Content */}
              <div className="mxd-error-page__content">
                <h1 className="mxd-error-page__title">{t("title")}</h1>

                <p className="mxd-error-page__desc">{t("description")}</p>

                <div className="mxd-error-page__actions">
                  <button
                    onClick={reset}
                    className="btn btn-anim btn-default btn-outline slide-right"
                  >
                    <span className="btn-caption">{t("retry")}</span>
                    <i className="ph-bold ph-arrow-clockwise" />
                  </button>
                  <Link
                    href="/"
                    className="btn btn-anim btn-default btn-accent slide-right-up"
                  >
                    <span className="btn-caption">{t("cta")}</span>
                    <i className="ph-bold ph-arrow-up-right" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
