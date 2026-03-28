"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  sources: { type: string; src: string }[];
  poster?: string;
  className?: string;
  preload?: "auto" | "metadata" | "none";
};

export function LazyVideo({ sources, poster, className, preload = "none" }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      preload={isVisible ? preload : "none"}
      autoPlay={isVisible}
      loop
      muted
      playsInline
      poster={poster}
    >
      {isVisible &&
        sources.map((s) => (
          <source key={s.src} type={s.type} src={s.src} />
        ))}
    </video>
  );
}
