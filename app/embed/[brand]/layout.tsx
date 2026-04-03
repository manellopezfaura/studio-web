import "@/public/css/hera.css"

export const metadata = {
  robots: "noindex, nofollow",
}

export function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "transparent",
          overflow: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  )
}

export default EmbedLayout
