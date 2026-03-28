"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type CardVariant = "light" | "accent" | "additional" | "dark";
type ImagePosition = "image-right" | "image-top-right" | "image-bottom" | "image-bottom-2" | "image-top";

type ServiceConfig = {
  id: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  imagePosition: ImagePosition;
  imageClass?: string;
  variant: CardVariant;
  colClass: string;
  justify: string;
  animClass: string;
  showBullets: boolean;
  infoWidthClass: string;
};

const variantClasses: Record<CardVariant, { bg: string; isInverse: boolean }> = {
  light:      { bg: "bg-base-tint", isInverse: false },
  accent:     { bg: "bg-accent",    isInverse: true  },
  additional: { bg: "bg-additional", isInverse: false },
  dark:       { bg: "bg-base-opp",  isInverse: true  },
};

const SERVICES: ServiceConfig[] = [
  {
    id: "brandIdentity",
    imageSrc: "/img/illustrations/1200x1200_service-image-01.webp",
    imageWidth: 910, imageHeight: 1200, imagePosition: "image-right",
    variant: "light", colClass: "col-xl-8", justify: "justify-between",
    animClass: "anim-uni-scale-in-right", showBullets: true, infoWidthClass: "width-50",
  },
  {
    id: "productDesign",
    imageSrc: "/img/illustrations/1200x1200_service-image-02.webp",
    imageWidth: 1200, imageHeight: 1200, imagePosition: "image-top-right", imageClass: "mxd-move",
    variant: "accent", colClass: "col-xl-4", justify: "justify-end",
    animClass: "anim-uni-scale-in-left", showBullets: false, infoWidthClass: "",
  },
  {
    id: "webDesign",
    imageSrc: "/img/illustrations/1200x1200_service-image-03.webp",
    imageWidth: 1200, imageHeight: 1200, imagePosition: "image-bottom", imageClass: "mxd-rotate-slow",
    variant: "additional", colClass: "col-xl-4", justify: "",
    animClass: "anim-uni-scale-in-right", showBullets: false, infoWidthClass: "",
  },
  {
    id: "aiAutomation",
    imageSrc: "/img/illustrations/1200x1200_service-image-04.webp",
    imageWidth: 891, imageHeight: 1200, imagePosition: "image-bottom",
    variant: "dark", colClass: "col-xl-4", justify: "",
    animClass: "anim-uni-scale-in", showBullets: false, infoWidthClass: "",
  },
  {
    id: "marketingPerformance",
    imageSrc: "/img/illustrations/1200x1200_service-image-05.webp",
    imageWidth: 1200, imageHeight: 996, imagePosition: "image-top",
    variant: "light", colClass: "col-xl-4", justify: "justify-end",
    animClass: "anim-uni-scale-in-left", showBullets: false, infoWidthClass: "",
  },
];

export function ServicesShowcase() {
  const t = useTranslations("ServicesPage.Showcase");

  return (
    <div className="mxd-section overflow-hidden padding-pre-title">
      <div className="mxd-container grid-container">
        <div className="mxd-block">
          <div className="mxd-services-cards-s">
            <h2 className="sr-only">{t("sectionTitle")}</h2>
            <div className="container-fluid px-0">
              <div className="row gx-0">
                {SERVICES.map((svc) => {
                  const v = variantClasses[svc.variant];
                  const tags = t.raw(`${svc.id}.tags`) as string[];
                  const bullets = t.raw(`${svc.id}.bullets`) as string[];
                  const tagClass = v.isInverse ? "tag-outline-opposite" : "tag-outline";
                  const textClass = v.isInverse ? "t-opposite" : "t-bright";
                  const innerCls = [
                    "mxd-services-cards-s__inner",
                    svc.justify,
                    v.bg,
                    "radius-l padding-4",
                  ].filter(Boolean).join(" ");

                  return (
                    <div
                      key={svc.id}
                      className={`col-12 ${svc.colClass} mxd-services-cards-s__item mxd-grid-item ${svc.animClass}`}
                    >
                      <div className={innerCls}>
                        {/* Title */}
                        <div className="mxd-services-cards-s__title">
                          <h3 className={`${v.isInverse ? "opposite" : ""} anim-uni-in-up`}>
                            {t(`${svc.id}.title`)}
                          </h3>
                        </div>

                        {/* Info: tags + desc + bullets */}
                        <div className={`mxd-services-cards-s__info${svc.infoWidthClass ? ` ${svc.infoWidthClass}` : ""}`}>
                          <div className="mxd-services-cards-s__tags">
                            {tags.map((tag) => (
                              <span key={tag} className={`tag tag-default ${tagClass} anim-uni-in-up`}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          <p className={`${textClass} anim-uni-in-up`}>
                            {t(`${svc.id}.desc`)}
                          </p>

                          {svc.showBullets && (
                            <ul className="svc-card-bullets anim-uni-in-up">
                              {bullets.map((bullet, i) => (
                                <li key={i} className={`svc-card-bullet svc-card-bullet--${v.isInverse ? "light" : "dark"}`}>
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Decorative image */}
                        <div className={`mxd-services-cards-s__image ${svc.imagePosition}`}>
                          <Image
                            className={svc.imageClass}
                            alt=""
                            src={svc.imageSrc}
                            width={svc.imageWidth}
                            height={svc.imageHeight}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
