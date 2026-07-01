import Footer2 from "@/components/footers/Footer2";
import { Link } from "@/i18n/routing";
import { pageMetadata, legalEntity } from "@/data/seo-config";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: pageMetadata.cookies.title,
  description: pageMetadata.cookies.description,
  alternates: { canonical: pageMetadata.cookies.canonical },
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <main id="mxd-page-content" className="mxd-page-content inner-page-content">
        <div className="mxd-section padding-pre-title">
          <div className="mxd-container">
            <div className="mxd-block">
              <h1 className="text-center mb-5">Política de Cookies</h1>
              <div className="content-text">
                <h2>1. ¿Qué son las cookies?</h2>
                <p>
                  Una cookie es un pequeño archivo de texto que un sitio web
                  almacena en tu navegador al visitarlo. Sirven para recordar
                  información sobre tu visita y, en algunos casos, para analizar
                  el uso del sitio.
                </p>

                <h2>2. Cookies que utilizamos</h2>
                <p>
                  En {legalEntity.name} usamos las cookies estrictamente
                  necesarias para el funcionamiento del sitio y, solo con tu
                  consentimiento, cookies de análisis.
                </p>

                <h3>Cookies técnicas (necesarias)</h3>
                <p>
                  Permiten la navegación y el uso de las funciones básicas, como
                  recordar tu preferencia de consentimiento de cookies. No
                  requieren consentimiento. Se almacenan en tu navegador
                  (localStorage) y no se comparten con terceros.
                </p>

                <h3>Cookies analíticas y de medición (Google Tag Manager)</h3>
                <p>
                  Gestionamos nuestras etiquetas de medición con Google Tag
                  Manager (Google Ireland Ltd.). Solo con tu consentimiento se
                  cargan cookies de análisis (Google Analytics 4) y, en su caso,
                  de medición publicitaria (Google Ads). Estas cookies{" "}
                  <strong>solo se activan si das tu consentimiento</strong> en el
                  banner. Las principales son:
                </p>
                <ul>
                  <li>
                    <strong>_ga</strong> — distingue usuarios. Duración: 2 años.
                  </li>
                  <li>
                    <strong>_ga_&lt;ID&gt;</strong> — mantiene el estado de la
                    sesión. Duración: 2 años.
                  </li>
                  <li>
                    <strong>_gid</strong> — distingue usuarios. Duración: 24
                    horas.
                  </li>
                  <li>
                    <strong>_gcl_au</strong> — medición de conversiones de Google
                    Ads, solo si hay campañas activas. Duración: 90 días.
                  </li>
                </ul>

                <h2>3. Gestión y retirada del consentimiento</h2>
                <p>
                  Al acceder por primera vez al sitio te mostramos un banner
                  donde puedes <strong>aceptar</strong> o{" "}
                  <strong>rechazar</strong> las cookies analíticas. Si las
                  rechazas, no se cargará ninguna cookie de análisis ni de
                  publicidad. Puedes cambiar tu decisión en cualquier momento
                  borrando los datos del sitio en tu navegador, lo que hará que
                  el banner vuelva a aparecer.
                </p>
                <p>
                  También puedes bloquear o eliminar las cookies desde la
                  configuración de tu navegador (Chrome, Firefox, Safari, Edge).
                </p>

                <h2>4. Más información</h2>
                <p>
                  Para cualquier duda sobre esta política de cookies puedes
                  escribirnos a{" "}
                  <a href={`mailto:${legalEntity.email}`}>{legalEntity.email}</a>
                  . Consulta también nuestra{" "}
                  <Link href="/privacy-policy">Política de Privacidad</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer2 />
    </>
  );
}
