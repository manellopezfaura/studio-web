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
      document.querySelectorAll(".anim-uni-in-up, .anim-uni-scale-in, .anim-uni-scale-in-right, .anim-uni-scale-in-left, .loading__item, .loading__fade, .animate-card-2, .animate-card-3, .animate-card-4, .animate-card-5, .reveal-type")
        .forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "none";
        });
      return;
    }

    const initAnim = () => {
      const docStyle = getComputedStyle(document.documentElement);

      // Start the entry animations BEFORE the element enters the viewport so
      // fast scrolling never reveals an element that's still half-faded.
      // "top bottom-=120" fires when the element's top is 120px below the
      // viewport bottom — animation gets a head start and finishes by the
      // time the element is comfortably in view.
      const ENTRY_START = "top bottom-=120";

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
              start: ENTRY_START,
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
              start: ENTRY_START,
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
              start: ENTRY_START,
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
              start: ENTRY_START,
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

    // Double-rAF: arranca la coreografía tras dos frames para no escribir
    // estilos inline sobre nodos que React aún está hidratando (provocaba
    // hydration mismatch en consola). Coste: ~32ms, imperceptible — los
    // elementos siguen ocultos por CSS (html.has-js) durante la espera.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => initAnim());
    });

    // Safety fallback: if an element whose entry-trigger already passed is
    // still invisible after 2.5s (failed init, killed trigger), force it
    // visible. ONLY elements in or above the viewport — below-fold elements
    // are legitimately waiting for their scroll trigger; forcing those made
    // them pop in at 2.5s and snap back to 0 when their trigger fired while
    // scrolling (visible flicker).
    const safetyTimer = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(
          ".anim-uni-in-up, .anim-uni-scale-in, .anim-uni-scale-in-right, .anim-uni-scale-in-left, .loading__item, .loading__fade, .animate-card-2, .animate-card-3, .animate-card-4, .animate-card-5, .reveal-type"
        )
        .forEach((el) => {
          const inOrAboveViewport =
            el.getBoundingClientRect().top < window.innerHeight - 60;
          if (
            inOrAboveViewport &&
            parseFloat(getComputedStyle(el).opacity) < 0.95
          ) {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
        });
    }, 2500);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
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
