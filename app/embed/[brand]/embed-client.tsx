"use client"

import { HeraChat } from "@/components/hera/HeraChat"

interface EmbedClientProps {
  assistantName: string
  avatarLetter: string
  studioName: string
  apiUrl: string
}

export function EmbedClient({
  assistantName,
  avatarLetter,
  studioName,
  apiUrl,
}: EmbedClientProps) {
  return (
    <HeraChat
      assistantName={assistantName}
      avatarLetter={avatarLetter}
      studioName={studioName}
      apiUrl={apiUrl}
    />
  )
}
