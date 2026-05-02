"use client";
import Image from "next/image";
import { Link } from "@/i18n/routing";

import StackCards from "../animation/StackCards";
import { projectsAll } from "@/data/projects.json";
import { useTranslations } from "next-intl";

// Featured projects shown in the top stacking cards. The remaining
// projects appear below in the hover-reveal list (PortfolioList).
const FEATURED_SLUGS = [
  "hera",
  "flamingos",
  "luminar",
  "there-you-are",
  "wire-mesh",
] as const;

const featuredProjects = FEATURED_SLUGS.map(
  (slug) => projectsAll.find((p) => p.slug === slug)!,
);

export default function Portfolios1() {
  const t = useTranslations("WorksPage.Hero");

  return (
    <>
      {/* Section - Inner Page Headline Start */}
      <div className="mxd-section mxd-section-inner-headline padding-headline-pre-stack">
        <div className="mxd-container grid-container">
          {/* Block - Inner Page Headline Start */}
          <div className="mxd-block loading-wrap">
            <div className="container-fluid px-0">
              <div className="row gx-0">
                {/* Inner Headline Name Start */}
                <div className="col-12 col-xl-2 mxd-grid-item no-margin">
                  <div className="mxd-block__name name-inner-headline loading__item">
                    <p className="mxd-point-subtitle">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20px"
                        height="20px"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill="currentColor"
                          d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
                    c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
                    c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
                    c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
                    c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
                    c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
                    c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"
                        />
                      </svg>

                      <span>{t("subtitle")}</span>
                    </p>
                  </div>
                </div>
                {/* Inner Headline Name Start */}
                {/* Inner Headline Content Start */}
                <div className="col-12 col-xl-10 mxd-grid-item no-margin">
                  <div className="mxd-block__content">
                    <div className="mxd-block__inner-headline loading__item">
                      <h1 className="inner-headline__title headline-img-after headline-img-03">
                        {t("title")}
                      </h1>
                      {/* <p class="inner-headline__text t-large t-bright">I wonder if I've been changed 
                  in the night? Let me think. Was I the same when I got up this morning? 
                  I almost think I can remember feeling a little different.</p> */}
                    </div>
                  </div>
                </div>
                {/* Inner Headline Content End */}
              </div>
            </div>
          </div>
          {/* Block - Inner Page Headline End */}
        </div>
      </div>
      {/* Section - Inner Page Headline End */}
      {/* Section - Projects Stacking Cards Start */}
      <div className="mxd-section padding-stacked-section">
        <div className="mxd-container grid-container">
          {/* Block - Projects Stacking Cards #01 Start */}
          <div className="mxd-block mxd-grid-item no-margin">
            <div className="content__block loading__fade">
              <StackCards stackName="projects-stack" className="stack-wrapper">
                {featuredProjects.map((s, idx) => (
                  <div
                    key={s.id}
                    className="mxd-projects-stack__inner justify-between"
                  >
                    <div className="mxd-projects-stack__image">
                      <Image
                        alt={`${s.title} — 107 Studio`}
                        src={s.image}
                        width={1920}
                        height={1080}
                        priority={idx === 0}
                      />
                    </div>
                    <div className="mxd-projects-stack__tags">
                      {s.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="tag tag-default tag-outline-permanent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mxd-projects-stack__footer">
                      <div className="mxd-projects-stack__title no-margin">
                        <h2 className="permanent-light">{s.title}</h2>
                      </div>
                      <Link
                        href={`/projects/${s.slug}`}
                        className="mxd-projects-stack__cta"
                        aria-label={`${t("view")} ${s.title}`}
                      >
                        <span>{t("view")}</span>
                        <i className="ph-bold ph-arrow-up-right" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </StackCards>
            </div>
          </div>
          {/* Block - Projects Stacking Cards #01 End */}
        </div>
      </div>
      {/* Section - Projects Stacking Cards End */}
    </>
  );
}
