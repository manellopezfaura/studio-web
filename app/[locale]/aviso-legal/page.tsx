import Footer2 from "@/components/footers/Footer2";
import { Link } from "@/i18n/routing";
import { pageMetadata, legalEntity, seoConfig } from "@/data/seo-config";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: pageMetadata.avisoLegal.title,
  description: pageMetadata.avisoLegal.description,
  alternates: { canonical: pageMetadata.avisoLegal.canonical },
};

export default async function AvisoLegalPage({
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
              <h1 className="text-center mb-5">Aviso Legal</h1>
              <div className="content-text">
                <h2>1. Datos identificativos</h2>
                <p>
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de
                  julio, de Servicios de la Sociedad de la Información y de
                  Comercio Electrónico (LSSI-CE), se informa de los siguientes
                  datos del titular de este sitio web:
                </p>
                <ul>
                  <li>
                    <strong>Titular:</strong> {legalEntity.name}
                  </li>
                  <li>
                    <strong>CIF:</strong> {legalEntity.cif}
                  </li>
                  <li>
                    <strong>Domicilio social:</strong> {legalEntity.fullAddress}
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong>{" "}
                    <a href={`mailto:${legalEntity.email}`}>
                      {legalEntity.email}
                    </a>
                  </li>
                  <li>
                    <strong>Sitio web:</strong> {seoConfig.siteUrl}
                  </li>
                </ul>

                <h2>2. Objeto</h2>
                <p>
                  El presente aviso legal regula el acceso, navegación y uso del
                  sitio web {seoConfig.siteUrl} (en adelante, «el sitio web»). El
                  acceso y la utilización del sitio web atribuyen la condición de
                  usuario e implican la aceptación plena de todas las
                  disposiciones incluidas en este aviso legal.
                </p>

                <h2>3. Condiciones de uso</h2>
                <p>
                  El usuario se compromete a hacer un uso adecuado de los
                  contenidos y servicios del sitio web y a no emplearlos para
                  incurrir en actividades ilícitas, contrarias a la buena fe o al
                  orden público, ni para difundir contenidos de carácter racista,
                  xenófobo o que atenten contra los derechos humanos.
                </p>

                <h2>4. Propiedad intelectual e industrial</h2>
                <p>
                  Todos los contenidos del sitio web (textos, fotografías,
                  gráficos, imágenes, diseño, código fuente y marcas) son
                  titularidad de {legalEntity.name} o de terceros que han
                  autorizado su uso. Queda prohibida su reproducción,
                  distribución o transformación sin autorización expresa del
                  titular.
                </p>

                <h2>5. Exclusión de responsabilidad</h2>
                <p>
                  {legalEntity.name} no se hace responsable de los daños o
                  perjuicios derivados del acceso o uso del sitio web, ni de la
                  falta de disponibilidad temporal del mismo por causas técnicas.
                  El sitio web puede contener enlaces a sitios de terceros sobre
                  cuyos contenidos {legalEntity.name} no ejerce control alguno.
                </p>

                <h2>6. Protección de datos</h2>
                <p>
                  El tratamiento de los datos personales de los usuarios se rige
                  por lo establecido en la{" "}
                  <Link href="/privacy-policy">Política de Privacidad</Link> y la{" "}
                  <Link href="/cookies">Política de Cookies</Link>.
                </p>

                <h2>7. Legislación aplicable y jurisdicción</h2>
                <p>
                  El presente aviso legal se rige por la legislación española.
                  Para la resolución de cualquier controversia, las partes se
                  someten a los juzgados y tribunales del domicilio del usuario,
                  cuando este actúe como consumidor.
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
