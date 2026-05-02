"use client";
import ReactLenis, { useLenis } from "lenis/react";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export default function LenisSmoothScroll() {
  const lenis = useLenis();
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
  }, [pathname, lenis]);

  useEffect(() => {
    if (!lenis) return;

    // Create scrollerProxy for better ScrollTrigger integration
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      scrollLeft(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    // Ensure scrollbar is visible and working
    document.body.style.overflow = "auto";

    // Update ScrollTrigger when Lenis scrolls
    lenis.on("scroll", ScrollTrigger.update);

    // Centralized refresh handler for all animations
    const handleRefresh = () => {
      // Small delay to ensure all components are ready
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    // Handle window resize
    const handleResize = () => {
      handleRefresh();
    };

    // Listen for ScrollTrigger refresh events
    ScrollTrigger.addEventListener("refresh", handleRefresh);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      // Revert scrollerProxy
      ScrollTrigger.scrollerProxy(document.body, {});
      // Reset body overflow
      document.body.style.overflow = "";
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
