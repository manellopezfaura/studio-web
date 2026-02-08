"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { startTransition } from "react";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === "es" ? "en" : "es";
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <button
            onClick={toggleLanguage}
            className="btn btn-outline-light btn-sm ms-3"
            style={{
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "5px 15px",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
            }}
        >
            {locale === "es" ? "EN" : "ES"}
        </button>
    );
}
