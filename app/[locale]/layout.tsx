import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import ClientLayout from "@/components/layout/ClientLayout";
import { DocumentLang } from "@/components/layout/DocumentLang";
import { Metadata } from "next";
import { seoConfig } from "@/data/seo-config";
import { getTranslations } from "next-intl/server";

// Generate static params for all locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });

    const title = t("title") || seoConfig.defaultTitle;
    const description = t("description") || seoConfig.defaultDescription;
    const baseUrl = seoConfig.siteUrl;

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
    } satisfies Metadata;
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as never)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <DocumentLang locale={locale} />
            <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
    );
}
