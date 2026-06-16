"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

// ✅ Only allow HTML tags here, not SVG:
type HtmlTag = keyof HTMLElementTagNameMap; // 'div' | 'span' | 'h1' | 'a' | ...

type RevealTextProps<T extends HtmlTag = "span"> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
  /** Per-character stagger, seconds. */
  stagger?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * Heading text that reveals its characters one-shot when it scrolls into view.
 * Driven by IntersectionObserver (not GSAP ScrollTrigger) so it fires reliably
 * under Lenis / fast scroll and never leaves the heading stuck dim or blank.
 */
export default function RevealText<T extends HtmlTag = "span">({
  as,
  className,
  children,
  stagger = 0.012,
  ...rest
}: RevealTextProps<T>) {
  const Tag = (as || "span") as unknown as React.ElementType;
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const reveal = () => el.classList.add("is-revealed");

    // Reduced motion: show plainly, no char choreography.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    let split: SplitType | null = null;
    try {
      split = new SplitType(el, { types: "chars" });
    } catch {
      reveal();
      return;
    }

    const chars = split.chars ?? [];
    // Container visible; characters hidden until they animate in.
    reveal();
    if (chars.length === 0) return;
    gsap.set(chars, { opacity: 0, yPercent: 20 });

    let done = false;
    const play = () => {
      if (done) return;
      done = true;
      gsap.to(chars, {
        opacity: 1,
        yPercent: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger,
        overwrite: true,
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          play();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    io.observe(el);

    // Failsafe: if it's already in/above the viewport (IO edge cases), play.
    const t = setTimeout(() => {
      if (!done && el.getBoundingClientRect().top < window.innerHeight) play();
    }, 2000);

    return () => {
      io.disconnect();
      clearTimeout(t);
      gsap.killTweensOf(chars);
      split?.revert();
    };
  }, [stagger]);

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
