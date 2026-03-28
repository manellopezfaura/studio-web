"use client";
import { Link } from "@/i18n/routing";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AnimatedButton from "../animation/AnimatedButton";
import ThemeSwitcherButton from "./ColorSwitcher";
import LanguageSwitcher from "../common/LanguageSwitcher";
import menuItems from "@/data/menu.json";
import { useTranslations } from "next-intl";

const NAV_ITEMS = menuItems.filter((item) => item.href !== "/");

export default function Header1() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.pageYOffset > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href?: string) => {
    if (!href) return false;
    const pathSegment = pathname.split("/").slice(2).join("/");
    const hrefClean = href.replace(/^\//, "");
    if (href === "/") return pathSegment === "";
    return pathSegment === hrefClean;
  };

  // Move pill to a given element
  const movePill = useCallback((el: Element | null) => {
    const pill = pillRef.current;
    const nav = navRef.current;
    if (!pill || !nav) return;
    if (!el) {
      pill.style.opacity = "0";
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    pill.style.left = `${linkRect.left - navRect.left}px`;
    pill.style.width = `${linkRect.width}px`;
    pill.style.opacity = "1";
  }, []);

  // Snap to active link (no slide animation on initial snap)
  const snapToActive = useCallback(() => {
    const pill = pillRef.current;
    const nav = navRef.current;
    if (!pill || !nav) return;
    const activeEl = nav.querySelector<HTMLAnchorElement>(".mxd-header__nav-link--active");
    if (activeEl) {
      // Disable transition for instant snap, then re-enable
      pill.style.transition = "none";
      movePill(activeEl);
      // Flush reflow before re-enabling transitions
      pill.getBoundingClientRect();
      pill.style.transition = "";
    } else {
      pill.style.opacity = "0";
    }
  }, [movePill]);

  // Snap pill on route change (after paint)
  useEffect(() => {
    const raf = requestAnimationFrame(snapToActive);
    return () => cancelAnimationFrame(raf);
  }, [pathname, snapToActive]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    movePill(e.currentTarget);
  };

  const handleMouseLeave = useCallback(() => {
    snapToActive();
  }, [snapToActive]);

  return (
    <header id="header" className={`mxd-header ${isHidden ? "is-hidden" : ""}`}>
      {/* header logo */}
      <div className="mxd-header__logo loading__fade">
        <Link href={`/`} className="mxd-logo">
          {/* logo icon */}
          <svg
            className="mxd-logo__image"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 56 56"
            enableBackground="new 0 0 56 56"
            xmlSpace="preserve"
          >
            <style
              type="text/css"
              dangerouslySetInnerHTML={{
                __html:
                  "\n              .mxd-logo__bg {\n                fill: var(--base-opp);\n              }\n              .mxd-logo__cat {\n                clip-path: url(#mxd-logo__id);\n                fill: var(--base);\n              }\n            ",
              }}
            />
            <path
              className="mxd-logo__bg"
              d="M56,28c0,11.1-2.9,28-28,28S0,39.1,0,28S2.9,0,28,0S56,16.9,56,28z"
            />
            <g>
              <defs>
                <path
                  id="mxd-logo__clippath"
                  d="M28,0C2.9,0,0,16.9,0,28s2.9,28,28,28s28-16.9,28-28S53.1,0,28,0z"
                />
              </defs>
              <clipPath id="mxd-logo__id">
                <use
                  xlinkHref="#mxd-logo__clippath"
                  style={{ overflow: "visible" }}
                />
              </clipPath>
              <path
                className="mxd-logo__cat"
                d="M33.6,34.5h0.9
          c0.5,0,0.9,0.4,0.9,0.9v3.7c0,0.5-0.4,0.9-0.9,0.9h-0.9c-0.5,0-0.9-0.4-0.9-0.9v-3.7C32.7,34.9,33.1,34.5,33.6,34.5z M20.5,37.3
          v1.9c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9-0.4,0.9-0.9v-3.7c0-0.5-0.4-0.9-0.9-0.9h-0.9c-0.5,0-0.9,0.4-0.9,0.9V37.3L20.5,37.3z
          M39.2,21.5v0.9c0,0.5-0.4,0.9-0.9,0.9h-0.9c-0.5,0-0.9-0.4-0.9-0.9v-0.9c0-0.5,0.4-0.9,0.9-0.9h0.9C38.8,20.5,39.2,21,39.2,21.5z
          M34.5,26.1h0.9c0.5,0,0.9-0.4,0.9-0.9v-0.9c0-0.5-0.4-0.9-0.9-0.9h-0.9c-0.5,0-0.9,0.4-0.9,0.9v0.9C33.6,25.7,34,26.1,34.5,26.1z
          M28,26.1h-4.7c-0.5,0-0.9,0.4-0.9,0.9V28c0,0.5,0.4,0.9,0.9,0.9h9.3c0.5,0,0.9-0.4,0.9-0.9v-0.9c0-0.5-0.4-0.9-0.9-0.9H28L28,26.1
          z M19.6,24.3v0.9c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9-0.4,0.9-0.9v-0.9c0-0.5-0.4-0.9-0.9-0.9h-0.9C20,23.3,19.6,23.8,19.6,24.3z
          M16.8,21.5v0.9c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9-0.4,0.9-0.9v-0.9c0-0.5-0.4-0.9-0.9-0.9h-0.9C17.2,20.5,16.8,21,16.8,21.5z
          M14,26.1v4.7c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9-0.4,0.9-0.9v-6.5c0-0.5-0.4-0.9-0.9-0.9h-0.9c-0.5,0-0.9,0.4-0.9,0.9V26.1
          L14,26.1z M11.2,34.5v1.9c0,0.5-0.4,0.9-0.9,0.9H7.5c-0.5,0-0.9,0.4-0.9,0.9v0.9c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9,0.4,0.9,0.9
          V42c0,0.5-0.4,0.9-0.9,0.9H7.5c-0.5,0-0.9,0.4-0.9,0.9v0.9c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9,0.4,0.9,0.9V56
          c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9-0.4,0.9-0.9v-6.5c0-0.5,0.4-0.9,0.9-0.9h3.7c0.5,0,0.9-0.4,0.9-0.9v-0.9
          c0-0.5-0.4-0.9-0.9-0.9h-3.7c-0.5,0-0.9-0.4-0.9-0.9v-6.5c0-0.5,0.4-0.9,0.9-0.9c0.5,0,0.9-0.4,0.9-0.9v-3.7c0-0.5-0.4-0.9-0.9-0.9
          h-0.9c-0.5,0-0.9,0.4-0.9,0.9L11.2,34.5L11.2,34.5z M42,26.1v-1.9c0-0.5-0.4-0.9-0.9-0.9h-0.9c-0.5,0-0.9,0.4-0.9,0.9v6.5
          c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9-0.4,0.9-0.9V26.1L42,26.1z M49.5,39.2v-0.9c0-0.5-0.4-0.9-0.9-0.9h-2.8
          c-0.5,0-0.9-0.4-0.9-0.9v-3.7c0-0.5-0.4-0.9-0.9-0.9h-0.9c-0.5,0-0.9,0.4-0.9,0.9v3.7c0,0.5,0.4,0.9,0.9,0.9c0.5,0,0.9,0.4,0.9,0.9
          v6.5c0,0.5-0.4,0.9-0.9,0.9h-3.7c-0.5,0-0.9,0.4-0.9,0.9v0.9c0,0.5,0.4,0.9,0.9,0.9h3.7c0.5,0,0.9,0.4,0.9,0.9V56
          c0,0.5,0.4,0.9,0.9,0.9h0.9c0.5,0,0.9-0.4,0.9-0.9v-9.3c0-0.5,0.4-0.9,0.9-0.9h0.9c0.5,0,0.9-0.4,0.9-0.9v-0.9
          c0-0.5-0.4-0.9-0.9-0.9h-0.9c-0.5,0-0.9-0.4-0.9-0.9v-0.9c0-0.5,0.4-0.9,0.9-0.9h0.9C49,40.1,49.5,39.7,49.5,39.2L49.5,39.2z"
              />
            </g>
          </svg>
          {/* logo text */}
          <span className="mxd-logo__text">
            107
            <br />
            Studio
          </span>
        </Link>
      </div>
      {/* desktop navigation */}
      <nav
        ref={navRef}
        className="mxd-header__nav loading__fade"
        aria-label="Main navigation"
        onMouseLeave={handleMouseLeave}
      >
        <span ref={pillRef} className="mxd-header__nav-pill" aria-hidden="true" />
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href!}
            className={`mxd-header__nav-link${isActive(item.href) ? " mxd-header__nav-link--active" : ""}`}
            onMouseEnter={handleMouseEnter}
          >
            {item.translationKey ? t(item.translationKey) : item.title}
          </Link>
        ))}
      </nav>
      {/* header controls */}
      <div className="mxd-header__controls loading__fade">
        <ThemeSwitcherButton />
        <LanguageSwitcher />
        <AnimatedButton
          text={t("contact")}
          className="btn btn-anim btn-default btn-mobile-icon btn-outline slide-right"
          href="/contact"
        >
          <i className="ph-bold ph-envelope-simple" />
        </AnimatedButton>
      </div>
    </header>
  );
}
