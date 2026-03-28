import dynamic from "next/dynamic";
import Cta from "@/components/common/Cta";
import { setRequestLocale } from "next-intl/server";
import Footer2 from "@/components/footers/Footer2";
import Hero from "@/components/other-pages/about/Hero";
import MarqueeSlider from "@/components/other-pages/about/MarqueeSlider";
import MarqueeSlider2 from "@/components/other-pages/about/MarqueeSlider2";
import ParallaxBackround from "@/components/other-pages/about/ParallaxBackround";
import ProjectsMarqueeSlider from "@/components/other-pages/about/ProjectsMarqueeSlider";
import Techstack from "@/components/other-pages/about/Techstack";

const Team = dynamic(
  () => import("@/components/other-pages/about/Team")
);
import { pageMetadata, SITE_URL } from "@/data/seo-config";
import { Metadata } from "next";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: pageMetadata.aboutUs.title,
    description: pageMetadata.aboutUs.description,
    alternates: {
        canonical: pageMetadata.aboutUs.canonical,
    },
    openGraph: {
        title: pageMetadata.aboutUs.title,
        description: pageMetadata.aboutUs.description,
        url: pageMetadata.aboutUs.canonical,
        type: "website",
    },
};


// import { setRequestLocale } from "next-intl/server"; (Removed, putting it at top)

export default async function AboutUsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <WebPageSchema
                name={pageMetadata.aboutUs.title}
                description={pageMetadata.aboutUs.description}
                url={`${SITE_URL}/${locale}/about-us`}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: `${SITE_URL}/${locale}` },
                    { name: "About Us", url: `${SITE_URL}/${locale}/about-us` },
                ]}
            />
            <main id="mxd-page-content" className="mxd-page-content inner-page-content">
                <Hero />
                <MarqueeSlider />
                <Team />
                <Techstack />
                <ProjectsMarqueeSlider />
                <MarqueeSlider2 />
                <ParallaxBackround />
                <Cta />
            </main>
            <Footer2 />
        </>
    );
}
