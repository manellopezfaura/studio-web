"use client"

import { HeraChatWidget } from "@107/hera"
import "@107/hera/styles"
import type { BrandTheme } from "@/lib/brand-config"

interface EmbedClientProps {
  assistantName: string
  avatarLetter: string
  studioName: string
  apiUrl: string
  theme: BrandTheme
}

export function EmbedClient({
  assistantName,
  avatarLetter,
  studioName,
  apiUrl,
  theme,
}: EmbedClientProps) {
  return (
    <div
      style={{
        "--base": theme.base,
        "--base-opp": theme.baseOpp,
        "--additional": theme.accent,
      } as React.CSSProperties}
    >
      <HeraChatWidget
        apiUrl={apiUrl}
        assistantName={assistantName}
        avatar={avatarLetter}
        subtitle={studioName}
      />
    </div>
  )
}
