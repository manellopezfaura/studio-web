import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import ContactForm from "@/components/other-pages/contact/ContactForm";
import Locations from "@/components/other-pages/contact/Locations";
import PageTitle from "@/components/other-pages/contact/PageTitle";
import { pageMetadata, SITE_URL } from "@/data/seo-config";
import { Metadata } from "next";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: pageMetadata.contact.title,
    description: pageMetadata.contact.description,
    alternates: {
        canonical: pageMetadata.contact.canonical,
    },
    openGraph: {
        title: pageMetadata.contact.title,
        description: pageMetadata.contact.description,
        url: pageMetadata.contact.canonical,
        type: "website",
    },
};

import { setRequestLocale } from "next-intl/server";

export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
        <>
            <WebPageSchema
                name={pageMetadata.contact.title}
                description={pageMetadata.contact.description}
                url={`${SITE_URL}/${locale}/contact`}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: `${SITE_URL}/${locale}` },
                    { name: "Contact", url: `${SITE_URL}/${locale}/contact` },
                ]}
            />
            <main id="mxd-page-content" className="mxd-page-content inner-page-content">
                <div className="mxd-section padding-pre-title">
                    <div className="mxd-container">
                        <div className="mxd-block">
                            <PageTitle />
                            <ContactForm />
                            <Locations />
                        </div>
                    </div>
                </div>
                <Cta />
            </main>
            <Footer2 />
        </>
    );
}
