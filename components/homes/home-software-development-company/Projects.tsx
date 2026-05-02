import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import { projects1 } from "@/data/projects.json";
import RevealText from "@/components/animation/RevealText";
import AnimatedButton from "@/components/animation/AnimatedButton";
export default async function Projects() {
  const t = await getTranslations("HomePage.Projects");
  return (
    <div className="mxd-section padding-pre-grid mobile-grid-title">
      <div className="mxd-container grid-container">
        {/* Block - Projects Pinned #01 with Section Title Start */}
        <div className="mxd-block">
          <div className="mxd-pinned-projects">
            <div className="container-fluid px-0">
              <div className="row gx-0">
                <div className="col-12 col-xl-5 mxd-pinned-projects__static">
                  <div className="mxd-pinned-projects__static-inner no-margin">
                    {/* Section Title Start */}
                    <div className="mxd-section-title no-margin-desktop">
                      <div className="container-fluid p-0">
                        <div className="row g-0">
                          <div className="col-12 mxd-grid-item no-margin">
                            <div className="mxd-section-title__title">
                              <RevealText as="h2" className="reveal-type">
                                {t("title")}
                              </RevealText>
                            </div>
                          </div>
                          <div className="col-12 mxd-grid-item no-margin">
                            <div className="mxd-section-title__descr">
                              <p className="anim-uni-in-up">
                                {t("description")}
                              </p>
                            </div>
                          </div>
                          <div className="col-12 mxd-grid-item no-margin">
                            <div className="mxd-section-title__controls anim-uni-in-up">
                              <AnimatedButton
                                text={t("cta")}
                                className="btn btn-anim btn-default btn-outline slide-right-up"
                                href={`/works-simple`}
                              >
                                <i className="ph-bold ph-arrow-up-right" />
                              </AnimatedButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Section Title Start */}
                  </div>
                </div>
                <div className="col-12 col-xl-7 mxd-pinned-projects__scroll">
                  <div className="mxd-pinned-projects__scroll-inner mxd-grid-item no-margin">
                    {projects1.slice(0, 6).map((project, index) => {
                      const detailHref = `/projects/${project.slug}`;
                      return (
                        <div key={index} className="mxd-project-item">
                          <Link
                            className={`mxd-project-item__media ${project.anim}`}
                            href={detailHref}
                          >
                            <div
                              className={`mxd-project-item__preview ${project.previewClass} parallax-img-small`}
                            />
                            <div className="mxd-project-item__tags">
                              {project.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="tag tag-default tag-permanent"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </Link>
                          <div className="mxd-project-item__promo">
                            <div className="mxd-project-item__name">
                              <Link
                                className={project.anim}
                                href={detailHref}
                              >
                                <span>{project.title}</span>{" "}
                                {project.description}
                              </Link>
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
        {/* Block - Projects Pinned #01 with Section Title Start */}
      </div>
    </div>
  );
}
