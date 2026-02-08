import Cta from "@/components/common/Cta";
import Footer2 from "@/components/footers/Footer2";
import ContactForm from "@/components/other-pages/contact/ContactForm";
import Locations from "@/components/other-pages/contact/Locations";
import PageTitle from "@/components/other-pages/contact/PageTitle";
import Socials from "@/components/other-pages/contact/Socials";
import { pageMetadata } from "@/data/seo-config";
import { Metadata } from "next";

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

export default function ContactPage() {
    return (
        <>
            <main id="mxd-page-content" className="mxd-page-content inner-page-content">
                <div className="mxd-section padding-pre-title">
                    <div className="mxd-container">
                        <div className="mxd-block">
                            <PageTitle />
                            <ContactForm />
                            <Locations />
                            <Socials />
                        </div>
                    </div>
                </div>
                <Cta />
            </main>
            <Footer2 />
        </>
    );
}
