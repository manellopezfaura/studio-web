"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

// Entry-reveal elements: these were previously faded in via per-element GSAP
// ScrollTriggers, but those could fail to fire under Lenis smooth-scroll / fast
// scrolling / stale refreshes, leaving content stuck at opacity 0 (blank gaps).
// They are now revealed with an IntersectionObserver, which fires reliably when
// an element crosses the viewport. CSS (html.has-js …) handles the hidden state
// and the `.is-revealed` transition.
const REVEAL_SELECTOR =
  ".anim-uni-in-up, .anim-uni-scale-in, .anim-uni-scale-in-right, .anim-uni-scale-in-left, .animate-card-2, .animate-card-3, .animate-card-4, .animate-card-5";

// `.loading__fade` carriers (e.g. the nav hamburger) fade in once and then
// persist across client-side navigations — the hamburger lives in the layout
// and never unmounts. Remembering revealed elements at module scope keeps them
// from re-fading (a flicker) on every route change, while still catching
// first-time mounts. Keyed by element, so remounted nodes reveal again.
const revealedFades = new WeakSet<Element>();

export default function useGsapScrollScaleAnimations() {
  const pathname = usePathname();
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reduced motion: reveal everything immediately, no animation. Re-run on
    // DOM mutations so late-mounting carriers (e.g. the dynamically-imported nav
    // hamburger, a `.loading__fade`) are revealed too instead of staying stuck
    // at their CSS opacity:0.
    if (prefersReducedMotion) {
      const revealStatic = () =>
        document
          .querySelectorAll(`${REVEAL_SELECTOR}, .loading__item, .loading__fade, .reveal-type`)
          .forEach((el) => el.classList.add("is-revealed"));
      revealStatic();
      const moReduced = new MutationObserver(() => revealStatic());
      moReduced.observe(document.body, { childList: true, subtree: true });
      return () => moReduced.disconnect();
    }

    // ── Entry reveals via IntersectionObserver (reliable) ──────────────────
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        }
      },
      // Start a touch before the element fully enters for a natural feel.
      { rootMargin: "0px 0px 80px 0px", threshold: 0 },
    );

    // Observe every matching element once. Re-runnable so elements that mount
    // AFTER the initial scan (team cards, marquees, route transitions) also get
    // picked up — without this they'd never be observed and stay blank, which
    // is exactly what happened on client-side navigation.
    const seen = new WeakSet<Element>();
    const observeAll = () => {
      document
        .querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
        .forEach((el) => {
          if (seen.has(el) || el.classList.contains("is-revealed")) return;
          seen.add(el);
          // Already scrolled past (above viewport) → reveal now; it never
          // intersects on a downward scroll.
          if (el.getBoundingClientRect().bottom < 0) {
            el.classList.add("is-revealed");
          } else {
            io.observe(el);
          }
        });
    };
    observeAll();

    // `.loading__fade` carriers start hidden via CSS and fade in on entry. The
    // hamburger is inside a dynamically-imported client component, so it can
    // mount AFTER this effect's first pass — the old one-shot query missed it,
    // leaving it invisible-but-clickable. Reveal every `.loading__fade` present
    // now; the MutationObserver below re-runs this for late arrivals and the
    // safety timer backstops it. `revealedFades` (module scope) prevents a
    // re-fade on client-side navigation.
    const revealFades = () => {
      document.querySelectorAll<HTMLElement>(".loading__fade").forEach((el) => {
        if (revealedFades.has(el)) return;
        revealedFades.add(el);
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "none", delay: 0.1 },
        );
      });
    };
    revealFades();

    // `.loading__item` is the hero's staggered entrance. On a hard load the hero
    // is in the DOM when this runs; on client-side navigation it (with its
    // `.loading-wrap`) mounts AFTER — a one-shot query misses it, leaving the
    // hero stuck at CSS opacity:0 (blank page below the header). Reveal whatever
    // is present now with the stagger; the MutationObserver re-runs this for the
    // late hero and the safety timer backstops it.
    const revealedItems = new WeakSet<Element>();
    const revealLoadingItems = () => {
      const items = [
        ...document.querySelectorAll<HTMLElement>(".loading__item"),
      ].filter((el) => !revealedItems.has(el));
      if (!items.length) return;
      items.forEach((el) => revealedItems.add(el));
      gsap.set(items, { opacity: 0 });
      gsap.to(items, {
        duration: 0.55,
        ease: "power2.out",
        startAt: { y: 40 },
        y: 0,
        opacity: 1,
        delay: 0.05,
        stagger: 0.04,
      });
    };
    revealLoadingItems();

    // Catch late-mounting elements. MutationObserver only fires on node
    // add/remove (not on marquee transform changes), so it's cheap; debounced
    // to one rAF.
    let scheduled = false;
    const mo = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        observeAll();
        revealFades();
        revealLoadingItems();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Belt-and-suspenders: anything still hidden inside the viewport after 2.5s
    // gets revealed regardless (covers any edge case).
    const safetyTimer = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
        .forEach((el) => {
          if (
            !el.classList.contains("is-revealed") &&
            el.getBoundingClientRect().top < window.innerHeight
          ) {
            el.classList.add("is-revealed");
            io.unobserve(el);
          }
        });
      // Backstop: force any entry element still hidden to visible, and mark it
      // handled so a later mutation won't re-animate it.
      document
        .querySelectorAll<HTMLElement>(".loading__fade, .loading__item")
        .forEach((el) => {
          revealedFades.add(el);
          revealedItems.add(el);
          if (Number(getComputedStyle(el).opacity) < 1) gsap.set(el, { opacity: 1 });
        });
    }, 2500);

    // ── Scroll-linked scrub effects (these don't gate visibility) ──────────
    const ctx = gsap.context(() => {
      const docStyle = getComputedStyle(document.documentElement);

      gsap.utils.toArray<HTMLElement>(".anim-top-to-bottom").forEach((el) => {
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
            el,
            { transform: "translate3d(0, -100%, 0)" },
            { transform: "translate3d(0, 0, 0)" },
          );
      });

      gsap.utils.toArray<HTMLElement>(".anim-zoom-in-container").forEach((el) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top 82%", end: "top 14%", scrub: true },
          })
          .fromTo(
            el,
            { borderRadius: "200px", transform: "scale3d(0.94, 1, 1)" },
            {
              borderRadius: docStyle.getPropertyValue("--_radius-l"),
              transform: "scale3d(1, 1, 1)",
            },
          );
      });

      gsap.utils.toArray<HTMLElement>(".anim-zoom-out-container").forEach((el) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top 82%", end: "top 14%", scrub: true },
          })
          .fromTo(
            el,
            { borderRadius: "200px", transform: "scale3d(1.14, 1, 1)" },
            {
              borderRadius: docStyle.getPropertyValue("--_radius-l"),
              transform: "scale3d(1, 1, 1)",
            },
          );
      });
    });

    return () => {
      clearTimeout(safetyTimer);
      mo.disconnect();
      io.disconnect();
      ctx.revert();
    };
  }, [pathname]);
}
