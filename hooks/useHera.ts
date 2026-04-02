// hooks/useHera.ts
// Hook para consumir el chat de Hera desde el cliente

"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

const transport = new DefaultChatTransport({
  api: "/api/chat",
})

export function useHera() {
  return useChat({ transport })
}
