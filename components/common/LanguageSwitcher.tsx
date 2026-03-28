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
            className="language-switcher-btn"
            type="button"
            aria-label="Switch language"
            style={{
                marginLeft: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <span
                style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    pointerEvents: "none",
                }}
            >
                {locale === "es" ? "EN" : "ES"}
            </span>
            <style jsx>{`
                .language-switcher-btn {
                    background: transparent;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: var(--base-opp);
                    transition: color 0.3s ease;
                }
                .language-switcher-btn:hover,
                .language-switcher-btn:hover span,
                .language-switcher-btn:active,
                .language-switcher-btn:active span {
                    color: var(--accent) !important;
                }
            `}</style>
        </button>
    );
}
