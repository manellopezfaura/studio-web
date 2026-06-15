import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Services() {
  const t = await getTranslations("HomePage.ServicesCards");
  const renderTitle = (value: string) =>
    value.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  return (
    <div className="mxd-section overflow-hidden padding-pre-title">
      <div className="mxd-container grid-container">
        {/* Block - Services Cards #02 Start */}
        <div className="mxd-block">
          <div className="mxd-services-cards-s">
            <h2 className="sr-only">{t("srTitle")}</h2>
            <div className="container-fluid px-0">
              <div className="row gx-0">
                {/* Brand Identity */}
                <div className="col-12 col-xl-8 mxd-services-cards-s__item mxd-grid-item anim-uni-scale-in-right">
                  <div className="mxd-services-cards-s__inner justify-between bg-base-tint radius-l padding-4">
                    <div className="mxd-services-cards-s__title">
                      <h3 className="anim-uni-in-up">
                        {renderTitle(t("brandIdentity.title"))}
                      </h3>
                    </div>
                    <div className="mxd-services-cards-s__info width-50">
                      <div className="mxd-services-cards-s__tags">
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Logo Design
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Visual Identity
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Brand Strategy
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Guidelines
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Rebranding
                        </span>
                      </div>
                      <p className="anim-uni-in-up">{t("brandIdentity.desc")}</p>
                    </div>
                    <div className="mxd-services-cards-s__image image-right">
                      <Image
                        alt={t("brandIdentity.title").replace(/\n/g, " ")}
                        src="/img/illustrations/1200x1200_service-image-01.webp"
                        width={910}
                        height={1200}
                      />
                    </div>
                  </div>
                </div>
                {/* Product Design */}
                <div className="col-12 col-xl-4 mxd-services-cards-s__item mxd-grid-item anim-uni-scale-in-left">
                  <div className="mxd-services-cards-s__inner justify-end bg-accent radius-l padding-4">
                    <div className="mxd-services-cards-s__title">
                      <h3 className="opposite anim-uni-in-up">{renderTitle(t("productDesign.title"))}</h3>
                    </div>
                    <div className="mxd-services-cards-s__info">
                      <div className="mxd-services-cards-s__tags">
                        <span className="tag tag-default tag-outline-opposite anim-uni-in-up">
                          UI/UX
                        </span>
                        <span className="tag tag-default tag-outline-opposite anim-uni-in-up">
                          Prototyping
                        </span>
                        <span className="tag tag-default tag-outline-opposite anim-uni-in-up">
                          User Research
                        </span>
                      </div>
                      <p className="t-opposite anim-uni-in-up">{t("productDesign.desc")}</p>
                    </div>
                    <div className="mxd-services-cards-s__image image-top-right">
                      <Image
                        className="mxd-move"
                        alt={t("productDesign.title")}
                        src="/img/illustrations/1200x1200_service-image-02.webp"
                        width={1200}
                        height={1200}
                      />
                    </div>
                  </div>
                </div>
                {/* Web Design & Dev */}
                <div className="col-12 col-xl-4 mxd-services-cards-s__item mxd-grid-item anim-uni-scale-in-right">
                  <div className="mxd-services-cards-s__inner bg-additional radius-l padding-4">
                    <div className="mxd-services-cards-s__title">
                      <h3 className="anim-uni-in-up">{renderTitle(t("webDev.title"))}</h3>
                    </div>
                    <div className="mxd-services-cards-s__info">
                      <div className="mxd-services-cards-s__tags">
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Frontend
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Backend
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          E-Commerce
                        </span>
                      </div>
                      <p className="t-bright anim-uni-in-up">{t("webDev.desc")}</p>
                    </div>
                    <div className="mxd-services-cards-s__image image-bottom">
                      <Image
                        className="mxd-rotate-slow"
                        alt={t("webDev.title")}
                        src="/img/illustrations/1200x1200_service-image-03.webp"
                        width={1200}
                        height={1200}
                      />
                    </div>
                  </div>
                </div>
                {/* AI-Custom Automation */}
                <div className="col-12 col-xl-4 mxd-services-cards-s__item mxd-grid-item anim-uni-scale-in">
                  <div className="mxd-services-cards-s__inner bg-base-opp radius-l padding-4">
                    <div className="mxd-services-cards-s__title">
                      <h3 className="opposite anim-uni-in-up">{renderTitle(t("aiAutomation.title"))}</h3>
                    </div>
                    <div className="mxd-services-cards-s__info">
                      <div className="mxd-services-cards-s__tags">
                        <span className="tag tag-default tag-outline-opposite anim-uni-in-up">
                          Custom AI
                        </span>
                        <span className="tag tag-default tag-outline-opposite anim-uni-in-up">
                          Workflows
                        </span>
                        <span className="tag tag-default tag-outline-opposite anim-uni-in-up">
                          Integration
                        </span>
                      </div>
                      <p className="t-opposite anim-uni-in-up">{t("aiAutomation.desc")}</p>
                    </div>
                    <div className="mxd-services-cards-s__image image-bottom image-bottom-2">
                      <Image
                        alt={t("aiAutomation.title")}
                        src="/img/illustrations/1200x1200_service-image-04.webp"
                        width={891}
                        height={1200}
                      />
                    </div>
                  </div>
                </div>
                {/* Marketing Performance */}
                <div className="col-12 col-xl-4 mxd-services-cards-s__item mxd-grid-item anim-uni-scale-in-left">
                  <div className="mxd-services-cards-s__inner justify-end bg-base-tint radius-l padding-4">
                    <div className="mxd-services-cards-s__title">
                      <h3 className="anim-uni-in-up">{renderTitle(t("marketing.title"))}</h3>
                    </div>
                    <div className="mxd-services-cards-s__info">
                      <div className="mxd-services-cards-s__tags">
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Paid Ads
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          SEO
                        </span>
                        <span className="tag tag-default tag-outline anim-uni-in-up">
                          Analytics
                        </span>
                      </div>
                      <p className="anim-uni-in-up">{t("marketing.desc")}</p>
                    </div>
                    <div className="mxd-services-cards-s__image image-top">
                      <Image
                        alt={t("marketing.title")}
                        src="/img/illustrations/1200x1200_service-image-05.webp"
                        width={1200}
                        height={996}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - Services Cards #02 End */}
      </div>
    </div>
  );
}
