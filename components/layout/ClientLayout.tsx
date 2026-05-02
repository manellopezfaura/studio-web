"use client";

import dynamic from "next/dynamic";
import Header1 from "@/components/headers/Header1";
// InitScroll runs the page-entry GSAP choreography (.loading__item fade/slide).
// It must hydrate eagerly — when it was a dynamic chunk the hero stayed at
// opacity:0 for the chunk's load time and TypedText started typing in the
// invisible h1, so the entry animation revealed text mid-typing.
import InitScroll from "@/components/scroll/InitScroll";

const MobileMenu = dynamic(
  () => import("@/components/headers/MobileMenu"),
  { ssr: false }
);
const LenisSmoothScroll = dynamic(
  () => import("@/components/scroll/LenisSmoothScroll"),
  { ssr: false }
);
const ScrollTop = dynamic(
  () => import("@/components/scroll/ScrollTop"),
  { ssr: false }
);
const HeraChatWidget = dynamic(
  () => import("@/components/hera").then((mod) => mod.HeraChatWidget),
  { ssr: false }
);

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <MobileMenu />
      <Header1 />
      {children}
      <InitScroll />
      <ScrollTop />
      <LenisSmoothScroll />
      <HeraChatWidget apiUrl="/api/chat" assistantName="Hera" avatar="H" subtitle="107 Studio" />
    </>
  );
}
