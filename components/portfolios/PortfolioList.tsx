"use client";
import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import RevealText from "../animation/RevealText";
import AnimatedButton from "../animation/AnimatedButton";
import { projectsAll } from "@/data/projects.json";
import { useTranslations } from "next-intl";

// Slugs already shown in the featured stacking cards above. Filter them
// out here so we don't duplicate projects on the same page.
const FEATURED_SLUGS = new Set([
  "hera",
  "flamingos",
  "luminar",
  "there-you-are",
  "wire-mesh",
]);

const restProjects = projectsAll.filter((p) => !FEATURED_SLUGS.has(p.slug));

type HoverState = {
  activeIndex: number | null;
  x: number;
};
export default function PortfolioList() {
  const t = useTranslations("WorksPage.List");

  const [hoverState, setHoverState] = useState<HoverState>({
    activeIndex: null,
    x: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setHoverState({
      activeIndex: index,
      x: e.clientX,
    });
  };

  const handleMouseLeave = () => {
    setHoverState((pre) => {
      return {
        activeIndex: null,
        x: pre.x,
      };
    });
  };
  return (
    <div className="mxd-section overflow-hidden padding-grid-pre-mtext">
      <div className="mxd-container grid-container">
        {/* Block - Section Title Start */}
        <div className="mxd-block">
          <div className="mxd-section-title">
            <div className="container-fluid p-0">
              <div className="row g-0">
                <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrtitle">
                    <RevealText as="h2" className="reveal-type anim-uni-in-up">
                      {t("title")}
                    </RevealText>
                  </div>
                </div>
                <div className="col-12 col-xl-2 mxd-grid-item no-margin" />
                <div className="col-12 col-xl-4 mxd-grid-item no-margin">
                  <div className="mxd-section-title__hrcontrols pre-title anim-uni-in-up">
                    <AnimatedButton
                      text={t("clientsApprove")}
                      as={"a"}
                      className="btn btn-anim btn-default btn-outline slide-right-down"
                      href="#testimonials"
                    >
                      <i className="ph-bold ph-arrow-down-right" />
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - Section Title End */}
        {/* Block - Projects List #01 Start */}
        <div className="mxd-block">
          <div className="mxd-projects-list hover-reveal">
            {restProjects.map((item, idx) => (
              <Link
                key={item.id}
                className="mxd-projects-list__item hover-reveal__item"
                href={`/projects/${item.slug}`}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="mxd-projects-list__border anim-uni-in-up" />
                <div
                  className="hover-reveal__content hover-reveal-280x340"
                  style={{
                    opacity: hoverState.activeIndex === idx ? 1 : 0,
                    transform: "translate(-80%, -50%)",
                    left: hoverState.x,
                    pointerEvents: "none",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Image
                    style={{
                      transform:
                        hoverState.activeIndex === idx
                          ? "scale(1,1)"
                          : "scale(1,1.4)",
                      transition: "transform 0.3s ease",
                    }}
                    className="hover-reveal__image"
                    alt={`${item.title} — 107 Studio`}
                    src={item.thumb}
                    width={600}
                    height={730}
                  />
                </div>
                <div className="mxd-projects-list__inner">
                  <div className="container-fluid px-0">
                    <div className="row gx-0">
                      <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                        <div className="mxd-projects-list__title anim-uni-in-up">
                          <div className="mxd-projects-list__icon">
                            <i className="ph ph-arrow-up-right" />
                          </div>
                          <p>
                            <span>{item.title}</span>{" "}
                            <span className="t-muted">{item.subtitle}</span>
                          </p>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-xl-2 mxd-grid-item no-margin">
                        <div className="mxd-projects-list__tagslist">
                          <ul>
                            {item.tags.map((tag, i) => (
                              <li key={i} className="anim-uni-in-up">
                                <p className="t-small">{tag}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-xl-2 mxd-grid-item no-margin">
                        <div className="mxd-projects-list__date anim-uni-in-up">
                          <p className="t-small">{item.year}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mxd-projects-list__border anim-uni-in-up" />
              </Link>
            ))}
          </div>
        </div>
        {/* Block - Projects List #01 End */}
      </div>
    </div>
  );
}
