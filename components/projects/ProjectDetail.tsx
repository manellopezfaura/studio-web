import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import AnimatedButton from "@/components/animation/AnimatedButton";
import { projectsAll } from "@/data/projects.json";

type Project = (typeof projectsAll)[number];

interface ProjectDetailProps {
  project: Project;
  nextProject: Project;
}

export async function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const t = await getTranslations("ProjectDetails");
  const tItem = await getTranslations(`ProjectDetails.items.${project.slug}`);

  return (
    <article className="mxd-project-detail">
      {/* HERO ----------------------------------------------------------- */}
      <section className="mxd-section mxd-project-detail__hero loading-wrap">
        <div className="mxd-project-detail__hero-media">
          {project.video ? (
            <video
              className="mxd-project-detail__hero-video"
              src={project.video}
              poster={project.poster ?? undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : project.poster ? (
            <Image
              className="mxd-project-detail__hero-image"
              src={project.poster}
              alt=""
              width={1920}
              height={1080}
              priority
              aria-hidden="true"
            />
          ) : null}
          <span className="mxd-project-detail__hero-overlay" aria-hidden="true" />
        </div>

        <div className="mxd-container grid-container mxd-project-detail__hero-content">
          <div className="loading__item">
            <Link
              href="/works-simple"
              className="mxd-project-detail__back"
            >
              <i className="ph-bold ph-arrow-left" aria-hidden="true" />
              <span>{t("back")}</span>
            </Link>
          </div>
          <p className="mxd-project-detail__subtitle loading__item">
            {project.subtitle}
          </p>
          {/* Plain h1 — RevealText with scrub:true left chars at intermediate
              opacity (~0.72) because this title sits high in the page and
              the scrub trigger never reaches its end. The loading__item
              class still handles the fade-in on page load. */}
          <h1 className="mxd-project-detail__title loading__item">
            {project.title}
          </h1>
          <div className="mxd-project-detail__hero-cta loading__item">
            <AnimatedButton
              text={t("viewLive")}
              as="a"
              className="btn btn-anim btn-default btn-outline-permanent btn-on-hero slide-right-up"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ph-bold ph-arrow-up-right" aria-hidden="true" />
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* META ----------------------------------------------------------- */}
      <section className="mxd-section padding-default">
        <div className="mxd-container grid-container">
          <dl className="mxd-project-detail__meta">
            <div className="mxd-project-detail__meta-item anim-uni-in-up">
              <dt>{t("role")}</dt>
              <dd>{tItem("role")}</dd>
            </div>
            <div className="mxd-project-detail__meta-item anim-uni-in-up">
              <dt>{t("year")}</dt>
              <dd>{project.year}</dd>
            </div>
            <div className="mxd-project-detail__meta-item anim-uni-in-up">
              <dt>{t("scope")}</dt>
              <dd>{tItem("scope")}</dd>
            </div>
          </dl>

          {project.tags.length > 0 && (
            <div className="mxd-project-detail__stack anim-uni-in-up">
              <span className="mxd-project-detail__stack-label">
                {t("stack")}
              </span>
              <ul className="mxd-project-detail__stack-list">
                {project.tags.map((tag) => (
                  <li key={tag} className="tag tag-default tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* OVERVIEW ----------------------------------------------------- */}
          <div className="mxd-project-detail__overview">
            <p className="mxd-project-detail__overview-label anim-uni-in-up">
              <span aria-hidden="true" />
              {t("overview")}
            </p>
            <div className="mxd-project-detail__overview-body">
              <p className="mxd-project-detail__overview-lead anim-uni-in-up">
                {tItem("overview")}
              </p>
              <p className="mxd-project-detail__overview-text anim-uni-in-up">
                {tItem("description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY -------------------------------------------------------- */}
      {project.gallery.length > 0 && (
        <section className="mxd-section padding-pre-title">
          <div className="mxd-container grid-container">
            <div className="mxd-project-detail__gallery">
              {project.gallery.map((src, idx) => (
                <figure
                  key={src + idx}
                  className={`mxd-project-detail__gallery-item anim-uni-in-up gallery-item--${
                    idx === 0
                      ? "lead"
                      : idx === 1
                        ? "wide"
                        : "tall"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${project.title} — ${idx + 1}`}
                    width={1920}
                    height={1080}
                    sizes="(max-width: 1024px) 100vw, 1200px"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEXT PROJECT --------------------------------------------------- */}
      <section className="mxd-section padding-default mxd-project-detail__next-section">
        <div className="mxd-container grid-container">
          <div className="mxd-project-detail__next anim-uni-in-up">
            <span className="mxd-project-detail__next-label">{t("next")}</span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="mxd-project-detail__next-link"
            >
              <span>{nextProject.title}</span>
              <i className="ph-bold ph-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
