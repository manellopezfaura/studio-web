import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Footer2 from "@/components/footers/Footer2";
import Cta from "@/components/common/Cta";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { projectsAll } from "@/data/projects.json";
import { routing } from "@/i18n/routing";
import { seoConfig } from "@/data/seo-config";

type Project = (typeof projectsAll)[number];

function getProject(slug: string): Project | undefined {
  return projectsAll.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projectsAll.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: "ProjectDetails.items" });
  const overview = t.has(`${slug}.overview`) ? t(`${slug}.overview`) : project.subtitle;

  const title = `${project.title} — ${project.subtitle}`;
  const url = `${seoConfig.siteUrl}/${locale}/projects/${slug}`;

  return {
    title,
    description: overview,
    alternates: {
      canonical: url,
      languages: {
        es: `/es/projects/${slug}`,
        en: `/en/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description: overview,
      url,
      type: "article",
      images: [{ url: project.poster ?? project.image, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: overview,
      images: [project.poster ?? project.image],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projectsAll.findIndex((p) => p.slug === slug);
  const nextProject = projectsAll[(currentIndex + 1) % projectsAll.length];

  // Pre-connect to the project's live URL during page render so the TLS
  // handshake is already established by the time the user clicks
  // "Ver en vivo". Cuts perceived "tarda mucho" delay on the new tab.
  const liveOrigin = (() => {
    try {
      return new URL(project.url).origin;
    } catch {
      return null;
    }
  })();

  return (
    <>
      {liveOrigin ? (
        <>
          <link rel="preconnect" href={liveOrigin} />
          <link rel="dns-prefetch" href={liveOrigin} />
        </>
      ) : null}
      <main id="mxd-page-content" className="mxd-page-content inner-page-content">
        <ProjectDetail project={project} nextProject={nextProject} />
        <Cta />
      </main>
      <Footer2 />
    </>
  );
}
