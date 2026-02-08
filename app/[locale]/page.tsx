import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import About from "@/components/homes/home-software-development-company/About";
import Capabilities from "@/components/homes/home-software-development-company/Capabilities";
import Facts from "@/components/homes/home-software-development-company/Facts";
import Hero from "@/components/homes/home-software-development-company/Hero";
import MarqueeSlider from "@/components/homes/home-software-development-company/MarqueeSlider";
import MarqueeSlider2 from "@/components/homes/home-software-development-company/MarqueeSlider2";
import ParallaxBanner from "@/components/homes/home-software-development-company/ParallaxBanner";
import ParallaxDivider from "@/components/homes/home-software-development-company/ParallaxDivider";
import Projects from "@/components/homes/home-software-development-company/Projects";
import Services from "@/components/homes/home-software-development-company/Services";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "107 Studio - Digital Studio | Brand, Product, Web & AI Solutions",
  description:
    "107 Studio is a digital studio specializing in Brand Identity, Product Design, Web Design & Development, AI-Custom Automation, and Marketing Performance.",
  openGraph: {
    title: "107 Studio - Digital Studio",
    description:
      "Brand Identity, Product Design, Web Design & Dev, AI-Custom Automation, Marketing Performance",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <main id="mxd-page-content" className="mxd-page-content">
        <Hero />
        <MarqueeSlider />
        <Services />
        <About />
        <ParallaxBanner />
        <Capabilities />
        <Projects />
        <MarqueeSlider2 />
        <Facts />
        <ParallaxDivider />
        <Cta />
      </main>
      <Footer2 />
    </>
  );
}
