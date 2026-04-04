import "@/public/css/hera.css"

export const metadata = {
  robots: "noindex, nofollow",
}

export function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <style>{`
          html.hera-inline .hera-panel {
            position: relative !important;
            bottom: auto !important;
            right: auto !important;
            width: 100% !important;
            height: 100vh !important;
            height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
            pointer-events: auto !important;
          }
        `}</style>
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.location.search.includes('inline')) {
            document.documentElement.classList.add('hera-inline');
          }
        `}} />
      </head>
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
