"use client";

import dynamic from "next/dynamic";

const TorusTextScene = dynamic(
  () =>
    import("@/components/animation/TorusTextScene").then(
      (mod) => mod.TorusTextScene
    ),
  { ssr: false }
);

interface DynamicTorusTextSceneProps {
  text?: string;
  className?: string;
}

export function DynamicTorusTextScene({
  text,
  className,
}: DynamicTorusTextSceneProps) {
  return <TorusTextScene text={text} className={className} />;
}
