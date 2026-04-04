"use client"

import { HeraChat } from "@/components/hera/HeraChat"
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
      <HeraChat
        assistantName={assistantName}
        avatarLetter={avatarLetter}
        studioName={studioName}
        apiUrl={apiUrl}
      />
    </div>
  )
}
