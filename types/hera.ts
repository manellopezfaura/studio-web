// types/hera.ts
// Tipos para el agente Hera

export type HeraRole = "user" | "assistant"

export interface HeraMessage {
  role: HeraRole
  content: string
}

export interface HeraLeadData {
  nombre: string
  email: string
  proyecto?: string
  servicios_interes?: string
  contexto?: string
}
