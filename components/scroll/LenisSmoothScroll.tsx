"use client";
import ReactLenis, { useLenis } from "lenis/react";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export default function LenisSmoothScroll() {
  const lenis = useLenis();
  const pathname = usePathname();

  // Scroll to top on route change; refresh on the next frame so the new
  // page's layout is what gets measured, not the outgoing one.
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [pathname, lenis]);

  useEffect(() => {
    if (!lenis) return;

    // Root Lenis scrolls the document natively, so ScrollTrigger needs no
    // scrollerProxy — just a position update per Lenis tick.
    //
    // NOTE: never call ScrollTrigger.refresh() from ScrollTrigger's own
    // "refresh" event — refresh() emits that event, so the wiring becomes a
    // self-sustaining loop that re-measures every pinned/scrubbed section
    // ~10×/s forever (visible jitter sitewide). ScrollTrigger already
    // refreshes itself on resize and on load.
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);
  // return null for ios
  if (
    typeof window !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    return null;
  }
  return (
    <ReactLenis
      root
      options={{
        // Slightly more responsive than the default lerp (0.1).
        // Users were reporting laggy/floaty scroll on long pages.
        lerp: 0.14,
        smoothWheel: true,
        // Wheel multiplier: 1 = native; lower means scrolling feels heavier.
        wheelMultiplier: 1,
      }}
    />
  );
}
