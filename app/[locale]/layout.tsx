import "../../public/css/styles.css";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import ClientLayout from "@/components/layout/ClientLayout";
import { Metadata } from "next";
import { seoConfig } from "@/data/seo-config";
import { OrganizationSchema } from "@/components/seo/JsonLd";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });

    const title = t("title") || seoConfig.defaultTitle;
    const description = t("description") || seoConfig.defaultDescription;
    const baseUrl = seoConfig.siteUrl; // Ensure this is set to your actual domain

    return {
        title: {
            default: title,
            template: `%s | ${seoConfig.siteName}`,
        },
        description: description,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `/${locale}`,
            languages: {
                es: "/es",
                en: "/en",
            },
        },
        openGraph: {
            type: "website",
            locale: locale,
            url: `${baseUrl}/${locale}`,
            siteName: seoConfig.siteName,
            title: title,
            description: description,
            images: [
                {
                    url: seoConfig.defaultImage,
                    width: 1200,
                    height: 630,
                    alt: seoConfig.siteName,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [seoConfig.defaultImage],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
const setColorSchemeScript = `
(function() {
  try {
    var scheme = localStorage.getItem('color-scheme') || 'light';
    document.documentElement.setAttribute('color-scheme', scheme);
  } catch(e) {}
})();
`;

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html suppressHydrationWarning lang={locale} className="no-touch">
            <head>
                <script dangerouslySetInnerHTML={{ __html: setColorSchemeScript }} />
                <OrganizationSchema />
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <ClientLayout>{children}</ClientLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
