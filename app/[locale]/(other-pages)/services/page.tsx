import dynamic from "next/dynamic";
import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import { HeroServices } from "@/components/other-pages/services/HeroServices";
import { ServicesShowcase } from "@/components/other-pages/services/ServicesShowcase";
import { ServicesStats } from "@/components/other-pages/services/ServicesStats";
import { ServicesMarquee } from "@/components/other-pages/services/ServicesMarquee";
import { ServiceProcess } from "@/components/other-pages/services/ServiceProcess";
const ParallaxDivider = dynamic(
  () => import("@/components/other-pages/services/ParallaxDivider")
);
import { pageMetadata, SITE_URL } from "@/data/seo-config";
import { Metadata } from "next";
import { WebPageSchema, ServiceSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: pageMetadata.services.title,
    description: pageMetadata.services.description,
    alternates: {
        canonical: pageMetadata.services.canonical,
    },
    openGraph: {
        title: pageMetadata.services.title,
        description: pageMetadata.services.description,
        url: pageMetadata.services.canonical,
        type: "website",
    },
};

import { setRequestLocale } from "next-intl/server";

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
        <>
            <WebPageSchema
                name={pageMetadata.services.title}
                description={pageMetadata.services.description}
                url={`${SITE_URL}/${locale}/services`}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: `${SITE_URL}/${locale}` },
                    { name: "Services", url: `${SITE_URL}/${locale}/services` },
                ]}
            />
            <ServiceSchema name="Brand Identity" description="Coherent brand systems that communicate essence, build trust, and stay in memory." />
            <ServiceSchema name="Product Design" description="Intuitive interfaces that solve real problems and turn complexity into seamless experiences." />
            <ServiceSchema name="Web Design & Development" description="Intentional design merged with modern engineering — every pixel and every line of code with purpose." />
            <ServiceSchema name="AI & Automation" description="AI as a tangible tool that multiplies capabilities, not a buzzword." />
            <ServiceSchema name="Marketing & Performance" description="Campaigns with clear metrics and measurable return on every dollar invested." />
            <main id="mxd-page-content" className="mxd-page-content inner-page-content">
                <HeroServices />
                <ServicesShowcase />
                <ServicesStats />
                <ServicesMarquee />
                <ServiceProcess />
                <ParallaxDivider />
                <Cta />
            </main>
            <Footer2 />
        </>
    );
}
