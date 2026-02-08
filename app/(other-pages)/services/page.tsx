import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import Hero from "@/components/other-pages/services/Hero";
import ParallaxDivider from "@/components/other-pages/services/ParallaxDivider";
import Services from "@/components/other-pages/services/Services";
import { pageMetadata } from "@/data/seo-config";
import { Metadata } from "next";

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

export default function ServicesPage() {
    return (
        <>
            <main id="mxd-page-content" className="mxd-page-content inner-page-content">
                <Hero />
                <Services />
                <ParallaxDivider />
                <Cta />
            </main>
            <Footer2 />
        </>
    );
}
