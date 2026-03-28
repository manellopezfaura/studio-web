import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Footer2 from "@/components/footers/Footer2";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <main id="mxd-page-content" className="mxd-page-content">
        <div className="mxd-section mxd-section-fullscreen">
          <div className="mxd-container grid-container fullwidth-container fullscreen-container">
            <div className="mxd-block fullscreen-block">
              <div className="mxd-error-page">

                {/* Glitch code */}
                <p
                  className="mxd-error-page__code"
                  data-text="404"
                  aria-hidden="true"
                >404</p>

                {/* Content */}
                <div className="mxd-error-page__content">
                  <h1 className="mxd-error-page__title">
                    {t("title")}
                  </h1>
                  <p className="mxd-error-page__desc">
                    {t("description")}
                  </p>
                  <div className="mxd-error-page__actions">
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
      <Footer2 />
    </>
  );
}
