import Footer2 from "@/components/footers/Footer2";
import { pageMetadata, legalEntity } from "@/data/seo-config";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: pageMetadata.privacyPolicy.title,
  description: pageMetadata.privacyPolicy.description,
  alternates: { canonical: pageMetadata.privacyPolicy.canonical },
};

export default async function PrivacyPolicyPage({
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
              <h1 className="text-center mb-5">Política de Privacidad</h1>
              <div className="content-text">
                <h2>1. Responsable del tratamiento</h2>
                <ul>
                  <li>
                    <strong>Titular:</strong> {legalEntity.name}
                  </li>
                  <li>
                    <strong>CIF:</strong> {legalEntity.cif}
                  </li>
                  <li>
                    <strong>Domicilio:</strong> {legalEntity.fullAddress}
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong>{" "}
                    <a href={`mailto:${legalEntity.email}`}>
                      {legalEntity.email}
                    </a>
                  </li>
                </ul>

                <h2>2. Datos que recopilamos</h2>
                <p>
                  Solo tratamos los datos que nos facilitas voluntariamente a
                  través del formulario de contacto: nombre, correo electrónico
                  y, opcionalmente, empresa, teléfono y el contenido de tu
                  mensaje. Si aceptas las cookies analíticas, también tratamos
                  datos de navegación de forma agregada (ver{" "}
                  <a href="/cookies">Política de Cookies</a>).
                </p>

                <h2>3. Finalidad del tratamiento</h2>
                <p>
                  Utilizamos tus datos para responder a tus consultas, gestionar
                  la relación comercial derivada de tu solicitud y, si procede,
                  enviarte la información que nos pidas. No se toman decisiones
                  automatizadas ni se elaboran perfiles.
                </p>

                <h2>4. Base legal</h2>
                <p>
                  La base legal es tu <strong>consentimiento</strong> al enviar
                  el formulario (art. 6.1.a RGPD) y el interés legítimo en
                  atender tu solicitud y mantener la relación que se derive de
                  ella (art. 6.1.f RGPD).
                </p>

                <h2>5. Conservación</h2>
                <p>
                  Conservamos tus datos durante el tiempo necesario para atender
                  tu solicitud y, posteriormente, durante los plazos legalmente
                  exigibles. Cuando dejen de ser necesarios, se suprimen de forma
                  segura.
                </p>

                <h2>6. Destinatarios</h2>
                <p>
                  No cedemos tus datos a terceros, salvo obligación legal. Para
                  prestar el servicio nos apoyamos en proveedores que actúan como
                  encargados del tratamiento con las debidas garantías:
                </p>
                <ul>
                  <li>
                    <strong>Vercel Inc.</strong> — alojamiento del sitio web.
                  </li>
                  <li>
                    <strong>Resend</strong> — envío de los correos del formulario
                    de contacto.
                  </li>
                  <li>
                    <strong>Supabase</strong> — almacenamiento de mensajes del
                    asistente.
                  </li>
                  <li>
                    <strong>Google Ireland Ltd.</strong> — analítica web (solo
                    con tu consentimiento).
                  </li>
                </ul>

                <h2>7. Tus derechos</h2>
                <p>
                  Puedes ejercer tus derechos de acceso, rectificación,
                  supresión, oposición, limitación del tratamiento y
                  portabilidad escribiendo a{" "}
                  <a href={`mailto:${legalEntity.email}`}>{legalEntity.email}</a>
                  . Si consideras que el tratamiento no se ajusta a la normativa,
                  puedes presentar una reclamación ante la Agencia Española de
                  Protección de Datos (
                  <a
                    href="https://www.aepd.es"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.aepd.es
                  </a>
                  ).
                </p>

                <h2>8. Cookies</h2>
                <p>
                  Este sitio utiliza cookies. Consulta nuestra{" "}
                  <a href="/cookies">Política de Cookies</a> para conocer cuáles
                  y cómo gestionarlas.
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
