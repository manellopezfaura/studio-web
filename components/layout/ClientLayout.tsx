"use client";

import dynamic from "next/dynamic";
import Header1 from "@/components/headers/Header1";

const MobileMenu = dynamic(
  () => import("@/components/headers/MobileMenu"),
  { ssr: false }
);
const InitScroll = dynamic(
  () => import("@/components/scroll/InitScroll"),
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
  () => import("@107/hera").then((mod) => mod.HeraChatWidget),
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
