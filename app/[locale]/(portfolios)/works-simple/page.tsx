import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";

import MarqueeSlider from "@/components/portfolios/MarqueeSlider";
import PortfolioList from "@/components/portfolios/PortfolioList";
import Portfolios1 from "@/components/portfolios/Portfolios1";

// Testimonials hidden — pendiente de tener opiniones reales de clientes.
// import dynamic from "next/dynamic";
// const Testimonials = dynamic(() => import("@/components/common/Testimonials"));
import { Metadata } from "next";
import { pageMetadata, getCanonicalUrl, SITE_URL } from "@/data/seo-config";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: pageMetadata.works.title,
  description: pageMetadata.works.description,
  alternates: {
    canonical: pageMetadata.works.canonical,
    languages: {
      es: getCanonicalUrl("/es/works-simple"),
      en: getCanonicalUrl("/en/works-simple"),
    },
  },
  openGraph: {
    title: pageMetadata.works.title,
    description: pageMetadata.works.description,
  },
};
import { setRequestLocale } from "next-intl/server";

export default async function WorksSimplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <WebPageSchema
        name={pageMetadata.works.title}
        description={pageMetadata.works.description}
        url={`${SITE_URL}/${locale}/works-simple`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${SITE_URL}/${locale}` },
          { name: "Works", url: `${SITE_URL}/${locale}/works-simple` },
        ]}
      />
      <main
        id="mxd-page-content"
        className="mxd-page-content inner-page-content"
      >
        <Portfolios1 />
        <PortfolioList />
        <MarqueeSlider />
        {/* <Testimonials /> */}
        <Cta />
      </main>
      <Footer2 />
    </>
  );
}
