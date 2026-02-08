import Footer2 from "@/components/footers/Footer2";
import { pageMetadata } from "@/data/seo-config";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: pageMetadata.terms.title,
    description: pageMetadata.terms.description,
    alternates: {
        canonical: pageMetadata.terms.canonical,
    },
};

export default function TermsPage() {
    return (
        <>
            <main id="mxd-page-content" className="mxd-page-content inner-page-content">
                <div className="mxd-section padding-pre-title">
                    <div className="mxd-container">
                        <div className="mxd-block">
                            <h1 className="text-center mb-5">Términos y Condiciones</h1>
                            <div className="content-text">
                                <p><strong>Última actualización:</strong> Febrero 2026</p>

                                <h2>1. Aceptación de los Términos</h2>
                                <p>Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones.</p>

                                <h2>2. Uso del Sitio</h2>
                                <p>Te comprometes a utilizar este sitio web de manera legal y respetuosa.</p>

                                <h2>3. Propiedad Intelectual</h2>
                                <p>Todo el contenido de este sitio web es propiedad de 107 Studio y está protegido por las leyes de propiedad intelectual.</p>

                                <h2>4. Limitación de Responsabilidad</h2>
                                <p>107 Studio no se hace responsable de daños derivados del uso de este sitio web.</p>

                                <h2>5. Modificaciones</h2>
                                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>

                                <h2>6. Ley Aplicable</h2>
                                <p>Estos términos se rigen por las leyes de España.</p>

                                <h2>7. Contacto</h2>
                                <p>Para cualquier consulta sobre estos términos, contáctanos a través de nuestro formulario de contacto.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer2 />
        </>
    );
}
