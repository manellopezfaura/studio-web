import Footer2 from "@/components/footers/Footer2";
import { pageMetadata } from "@/data/seo-config";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: pageMetadata.privacyPolicy.title,
    description: pageMetadata.privacyPolicy.description,
    alternates: {
        canonical: pageMetadata.privacyPolicy.canonical,
    },
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <main id="mxd-page-content" className="mxd-page-content inner-page-content">
                <div className="mxd-section padding-pre-title">
                    <div className="mxd-container">
                        <div className="mxd-block">
                            <h1 className="text-center mb-5">Política de Privacidad</h1>
                            <div className="content-text">
                                <p><strong>Última actualización:</strong> Febrero 2026</p>

                                <h2>1. Información que Recopilamos</h2>
                                <p>Recopilamos información que nos proporcionas directamente cuando te pones en contacto con nosotros a través de nuestro formulario de contacto.</p>

                                <h2>2. Uso de la Información</h2>
                                <p>Utilizamos la información recopilada para responder a tus consultas y proporcionarte los servicios solicitados.</p>

                                <h2>3. Protección de Datos</h2>
                                <p>Implementamos medidas de seguridad para proteger tu información personal de acuerdo con el RGPD.</p>

                                <h2>4. Tus Derechos</h2>
                                <p>Tienes derecho a acceder, rectificar, suprimir y portar tus datos personales. Para ejercer estos derechos, contáctanos.</p>

                                <h2>5. Cookies</h2>
                                <p>Utilizamos cookies para mejorar tu experiencia en nuestro sitio web.</p>

                                <h2>6. Contacto</h2>
                                <p>Para cualquier consulta sobre esta política de privacidad, contáctanos a través de nuestro formulario de contacto.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer2 />
        </>
    );
}
