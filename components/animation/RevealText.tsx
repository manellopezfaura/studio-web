"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

// ✅ Only allow HTML tags here, not SVG:
type HtmlTag = keyof HTMLElementTagNameMap; // 'div' | 'span' | 'h1' | 'a' | ...

type RevealTextProps<T extends HtmlTag = "span"> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  stagger?: number;
  opacityFrom?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function RevealText<T extends HtmlTag = "span">({
  as,
  className,
  children,
  start = "top 80%",
  end = "top 20%",
  scrub = true,
  stagger = 0.1,
  opacityFrom = 0.2,
  ...rest
}: RevealTextProps<T>) {
  const Tag = (as || "span") as unknown as React.ElementType;
  const elRef = useRef<HTMLElement | null>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);
  const splitRef = useRef<SplitType | null>(null);

  useEffect(() => {
    // Capture the current element so the cleanup uses the same reference
    // even if elRef.current changes between effect run and cleanup.
    const el = elRef.current;

    // Reduced motion: show the text plainly and skip the char choreography.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (el) gsap.set(el, { opacity: 1 });
      return;
    }

    const createAnimation = () => {
      if (!el) return;

      // Revert previous split if exists
      splitRef.current?.revert();

      const split = new SplitType(el, { types: "words,chars" });
      splitRef.current = split;

      const anim = gsap.from(split.chars, {
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub,
          toggleActions: "play none none reverse",
        },
        opacity: opacityFrom,
        duration: 1.2,
        stagger,
        ease: "power2.out",
      });

      // The chars now own the reveal — release the container from its CSS
      // pre-reveal state (html.has-js .reveal-type { opacity: .2 }) in the
      // same tick so there's no double-dimming and no full-bright flash.
      gsap.set(el, { opacity: 1 });

      animRef.current = anim;
    };
    // useEffect runs after the DOM is mounted — init synchronously. The old
    // 100ms setTimeout left a window where the SSR text painted full-bright
    // and then snapped to the dimmed pre-reveal state.
    createAnimation();

    return () => {
      // Clean up animation
      animRef.current?.kill();

      // Clean up SplitType
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }

      // Clean up ScrollTrigger instances for this element
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === el)
        .forEach((t) => t.kill());

      // No global refresh listener to remove
    };
  }, [start, end, scrub, stagger, opacityFrom]);

  return (
    <Tag
      ref={elRef}
      className={["reveal-type", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
