"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function useGsapScrollScaleAnimations() {
  const pathname = usePathname();
  useEffect(() => {
    // Respect prefers-reduced-motion: show all content immediately, skip animations
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      document.querySelectorAll(".anim-uni-in-up, .anim-uni-scale-in, .anim-uni-scale-in-right, .anim-uni-scale-in-left, .loading__item, .loading__fade, .animate-card-2, .animate-card-3, .animate-card-4, .animate-card-5")
        .forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "none";
        });
      return;
    }

    const initAnim = () => {
      const docStyle = getComputedStyle(document.documentElement);

      // ✅ Fade & slide up
      const animateInUp = document.querySelectorAll(".anim-uni-in-up");
      animateInUp.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, ease: "sine" },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              // end: "bottom 15%",
              once: true,
            },
          }
        );
      });

      // ✅ Scale-in center
      const animateInUpFront = document.querySelectorAll(".anim-uni-scale-in");
      animateInUpFront.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 1.2, ease: "sine" },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 15%",
              once: true,
            },
          }
        );
      });

      // ✅ Scale-in from right
      const animateInUpRight = document.querySelectorAll(
        ".anim-uni-scale-in-right"
      );
      animateInUpRight.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, x: -70, scale: 1.2, ease: "sine" },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 15%",
              once: true,
            },
          }
        );
      });

      // ✅ Scale-in from left
      const animateInUpLeft = document.querySelectorAll(
        ".anim-uni-scale-in-left"
      );
      animateInUpLeft.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, x: 70, scale: 1.2, ease: "sine" },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 15%",
              once: true,
            },
          }
        );
      });

      // ✅ Top to bottom animation
      const toBottomEl = document.querySelectorAll(".anim-top-to-bottom");
      toBottomEl.forEach((e) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".fullwidth-text__tl-trigger",
              start: "top 99%",
              end: "top 24%",
              scrub: true,
            },
          })
          .fromTo(
            e,
            { transform: "translate3d(0, -100%, 0)" },
            { transform: "translate3d(0, 0, 0)" }
          );
      });
      // ------------------------------------------------
      // Zoom animations (NEW ✅)
      // ------------------------------------------------
      const zoomInContainer = document.querySelectorAll(
        ".anim-zoom-in-container"
      );
      zoomInContainer.forEach((el) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 14%",
              scrub: true,
            },
          })
          .fromTo(
            el,
            { borderRadius: "200px", transform: "scale3d(0.94, 1, 1)" },
            {
              borderRadius: docStyle.getPropertyValue("--_radius-l"),
              transform: "scale3d(1, 1, 1)",
            }
          );
      });

      const zoomOutContainer = document.querySelectorAll(
        ".anim-zoom-out-container"
      );
      zoomOutContainer.forEach((el) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 14%",
              scrub: true,
            },
          })
          .fromTo(
            el,
            { borderRadius: "200px", transform: "scale3d(1.14, 1, 1)" },
            {
              borderRadius: docStyle.getPropertyValue("--_radius-l"),
              transform: "scale3d(1, 1, 1)",
            }
          );
      });

      const addCardBatch = (
        selector: string,
        opts: { batchMax: number; gridCols: number; delay?: number }
      ) => {
        const hasAny = document.querySelector(selector);
        if (!hasAny) return;

        // initial state (your original gsap.set before batching)
        gsap.set(selector, { y: 50, opacity: 0 });

        ScrollTrigger.batch(selector, {
          interval: 0.1,
          batchMax: opts.batchMax,
          start: "top 80%",
          end: "bottom 20%",
          ...(opts.delay ? { delay: opts.delay } : {}),
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              y: 0,
              ease: "sine",
              stagger: { each: 0.15, grid: [1, opts.gridCols] },
              overwrite: true,
            }),
          onLeave: (els) =>
            gsap.set(els, { opacity: 1, y: 0, overwrite: true }),
          onEnterBack: (els) =>
            gsap.to(els, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
          onLeaveBack: (els) =>
            gsap.set(els, { opacity: 0, y: 50, overwrite: true }),
        });
      };
      // -------------------------------
      // Batched cards (2/3/4/5)
      // -------------------------------
      addCardBatch(".animate-card-2", { batchMax: 2, gridCols: 2 });
      addCardBatch(".animate-card-3", { batchMax: 3, gridCols: 3 });
      addCardBatch(".animate-card-4", {
        batchMax: 4,
        gridCols: 4,
        delay: 1000,
      });
      addCardBatch(".animate-card-5", {
        batchMax: 5,
        gridCols: 5,
        delay: 1000,
      });

      // ✅ Loading animation
      // Page-entry choreography: was way too slow (~2s before the hero text was fully visible).
      // Trimmed to ~0.6s total: small initial delay + faster fade/slide.
      const loadingWrap = document.querySelector(".loading-wrap");
      if (loadingWrap) {
        const loadingItems = loadingWrap.querySelectorAll(".loading__item");
        const fadeInItems = document.querySelectorAll(".loading__fade");

        const pageAppearance = () => {
          gsap.set(loadingItems, { opacity: 0 });
          gsap.to(loadingItems, {
            duration: 0.55,
            ease: "power2.out",
            startAt: { y: 40 },
            y: 0,
            opacity: 1,
            delay: 0.05,
            stagger: 0.04,
          });

          gsap.set(fadeInItems, { opacity: 0 });
          gsap.to(fadeInItems, {
            duration: 0.4,
            ease: "none",
            opacity: 1,
            delay: 0.1,
          });
        };

        pageAppearance();
      }
    };

    // Remove global refresh listener - let individual components handle their own refresh
    // ScrollTrigger.addEventListener("refresh", handleRefresh);

    // useEffect already guarantees the DOM is mounted; no extra delay needed.
    // The previous 100ms setTimeout added perceptible lag to the page-entry feel.
    initAnim();

    // Safety fallback: after route changes or slow ScrollTrigger refreshes,
    // some `.anim-uni-*` elements can stay at opacity 0 forever (the trigger never fires
    // because the page already loaded with them in viewport). After 2.5s, force any
    // still-invisible animation element to its final state. This is a no-op for elements
    // that GSAP did animate correctly.
    const safetyTimer = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(
          ".anim-uni-in-up, .anim-uni-scale-in, .anim-uni-scale-in-right, .anim-uni-scale-in-left, .loading__item, .loading__fade"
        )
        .forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.95) {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
        });
    }, 2500);

    return () => {
      clearTimeout(safetyTimer);
      // Only kill our specific ScrollTriggers
      ScrollTrigger.getAll()
        .filter((st) => {
          const trigger = st.vars.trigger;
          if (!trigger || typeof trigger === "string" || Array.isArray(trigger))
            return false;
          const element = trigger as Element;
          return (
            element.classList &&
            (element.classList.contains("anim-uni-in-up") ||
              element.classList.contains("anim-uni-scale-in") ||
              element.classList.contains("anim-uni-scale-in-right") ||
              element.classList.contains("anim-uni-scale-in-left") ||
              element.classList.contains("anim-top-to-bottom") ||
              element.classList.contains("anim-zoom-in-container") ||
              element.classList.contains("anim-zoom-out-container") ||
              element.classList.contains("animate-card-2") ||
              element.classList.contains("animate-card-3") ||
              element.classList.contains("animate-card-4") ||
              element.classList.contains("animate-card-5"))
          );
        })
        .forEach((st) => st.kill());

      ScrollTrigger.clearScrollMemory();
    };
  }, [pathname]);
}
