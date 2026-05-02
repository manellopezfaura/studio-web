"use client";
import { Link } from "@/i18n/routing";
import { useCallback, useEffect, useRef } from "react";
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
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Auto-hide on scroll removed: the header stays fixed and visible at all times.
  // Only the active-link pill animates to indicate the current section.

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
    <header id="header" className="mxd-header">
      {/* header logo */}
      <div className="mxd-header__logo">
        <Link href={`/`} className="mxd-logo">
          {/* logo icon */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mxd-logo__image"
            src="/img/favicon/logo.svg"
            alt="107 Studio"
            width={56}
            height={56}
          />
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
        className="mxd-header__nav"
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
      <div className="mxd-header__controls">
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
