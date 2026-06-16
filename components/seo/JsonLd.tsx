import { seoConfig, legalEntity } from "@/data/seo-config";

// Registered postal address (PostalAddress) shared by the Organization and
// LocalBusiness schemas — the verifiable legal address.
const legalPostalAddress = {
    "@type": "PostalAddress",
    streetAddress: legalEntity.address,
    addressLocality: legalEntity.city,
    addressRegion: legalEntity.province,
    postalCode: legalEntity.postalCode,
    addressCountry: "ES",
};

interface OrganizationSchemaProps {
    name?: string;
    url?: string;
    logo?: string;
}

interface WebPageSchemaProps {
    name: string;
    description: string;
    url: string;
}

interface ServiceSchemaProps {
    name: string;
    description: string;
    provider?: string;
}

export function OrganizationSchema({
    name = seoConfig.siteName,
    url = seoConfig.siteUrl,
    logo = `${seoConfig.siteUrl}/img/logo.png`,
}: OrganizationSchemaProps = {}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        legalName: legalEntity.name,
        taxID: legalEntity.cif,
        vatID: `ES${legalEntity.cif}`,
        url,
        logo,
        description: seoConfig.defaultDescription,
        email: seoConfig.contact.email,
        ...(seoConfig.contact.phone ? { telephone: seoConfig.contact.phone } : {}),
        address: legalPostalAddress,
        sameAs: seoConfig.socialProfiles,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        image: `${seoConfig.siteUrl}/img/logo.png`,
        description: seoConfig.defaultDescription,
        email: seoConfig.contact.email,
        ...(seoConfig.contact.phone ? { telephone: seoConfig.contact.phone } : {}),
        address: legalPostalAddress,
        priceRange: "$$",
        openingHours: "Mo-Fr 09:00-18:00",
        sameAs: seoConfig.socialProfiles,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function WebPageSchema({ name, description, url }: WebPageSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name,
        description,
        url,
        isPartOf: {
            "@type": "WebSite",
            name: seoConfig.siteName,
            url: seoConfig.siteUrl,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function ServiceSchema({ name, description, provider = seoConfig.siteName }: ServiceSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        provider: {
            "@type": "Organization",
            name: provider,
            url: seoConfig.siteUrl,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
