import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import Hero from "@/components/other-pages/about/Hero";
import MarqueeSlider from "@/components/other-pages/about/MarqueeSlider";
import MarqueeSlider2 from "@/components/other-pages/about/MarqueeSlider2";
import ParallaxBackround from "@/components/other-pages/about/ParallaxBackround";
import ProjectsMarqueeSlider from "@/components/other-pages/about/ProjectsMarqueeSlider";
import Team from "@/components/other-pages/about/Team";
import Techstack from "@/components/other-pages/about/Techstack";
import { pageMetadata } from "@/data/seo-config";
import { Metadata } from "next";

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

export default function AboutUsPage() {
    return (
        <>
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
