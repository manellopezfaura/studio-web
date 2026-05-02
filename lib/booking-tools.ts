import { tool } from "ai"
import { z } from "zod"
import type { BrandConfig } from "./brand-config"

export function buildBookingTools(brand: BrandConfig) {
  if (!brand.bookingApiUrl || !brand.bookingApiKey) return undefined

  const apiUrl = brand.bookingApiUrl
  const headers = {
    "Content-Type": "application/json",
    "x-hera-booking-key": brand.bookingApiKey,
  }

  return {
    listServices: tool({
      description:
        "Lista los servicios disponibles para reservar (nombre, duración, precio). Usa esto cuando el usuario pregunte qué servicios hay o quiera reservar algo.",
      inputSchema: z.object({}),
      execute: async () => {
        const res = await fetch(`${apiUrl}/api/public/booking/services`, {
          headers,
        })
        if (!res.ok) return { error: "No se pudieron obtener los servicios" }
        const data = await res.json() as { services: Array<{ id: number; name: string; duration_minutes: number; price: number | null; description: string | null }> }
        return data
      },
    }),

    checkAvailability: tool({
      description:
        "Consulta los horarios disponibles para una fecha y servicio concretos. Devuelve los slots libres. Usa esto después de que el usuario elija un servicio y una fecha.",
      inputSchema: z.object({
        date: z.string().describe("Fecha en formato YYYY-MM-DD"),
        service_id: z.number().describe("ID del servicio elegido"),
      }),
      execute: async ({ date, service_id }) => {
        const res = await fetch(
          `${apiUrl}/api/public/booking/slots?date=${date}&service_id=${service_id}`,
          { headers },
        )
        if (!res.ok) return { error: "No se pudo consultar la disponibilidad" }
        const data = await res.json() as { date: string; slots: Array<{ start: string; end: string }> }
        if (data.slots.length === 0) {
          return { date, slots: [], message: "No hay horarios disponibles para esta fecha" }
        }
        return data
      },
    }),

    createBooking: tool({
      description:
        "Crea una reserva confirmada. Usa esto SOLO cuando tengas: servicio elegido, fecha+hora confirmada, y nombre del cliente. Pide confirmación al usuario antes de ejecutar.",
      inputSchema: z.object({
        service_id: z.number().describe("ID del servicio"),
        starts_at: z.string().describe("Fecha y hora de inicio en formato ISO 8601 (ej: 2026-04-15T10:00:00)"),
        client_name: z.string().describe("Nombre completo del cliente"),
        client_email: z.string().optional().describe("Email del cliente"),
        client_phone: z.string().optional().describe("Teléfono del cliente"),
      }),
      execute: async ({ service_id, starts_at, client_name, client_email, client_phone }) => {
        const res = await fetch(`${apiUrl}/api/public/booking/book`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            service_id,
            starts_at,
            client_name,
            client_email,
            client_phone,
          }),
        })

        if (res.status === 409) {
          return { error: "Ese horario ya no está disponible. Sugiere otra hora." }
        }
        if (!res.ok) {
          return { error: "No se pudo crear la reserva" }
        }

        const data = await res.json() as {
          ok: boolean
          booking: {
            id: number
            service: string
            duration_minutes: number
            price: number | null
            starts_at: string
            ends_at: string
            client_name: string
            status: string
          }
        }
        return {
          success: true,
          booking: data.booking,
          message: "Reserva creada correctamente",
        }
      },
    }),
  }
}
