// components/analytics/GoogleTagManager.tsx
// Google Tag Manager con Consent Mode v2. El contenedor se carga en todas las
// páginas, pero TODO tipo de almacenamiento (analítica/publicidad) está en
// "denied" por defecto hasta que el usuario acepta en el banner de cookies
// (RGPD/LSSI). Quien ya aceptó en una visita previa pasa a "granted" ANTES de
// que arranque GTM, así nunca se rastrea sin consentimiento previo. El banner
// (CookieConsent) cambia el estado con window.gtag('consent','update', …).

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KKS246HF";

// Debe coincidir con COOKIE_CONSENT_KEY de CookieConsent.tsx. Se repite como
// literal porque este script se inyecta como string en el <head>.
const CONSENT_KEY = "cookie-consent";

function gtmInitScript(id: string): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'granted',
  security_storage:'granted',
  wait_for_update:500
});
try {
  if (localStorage.getItem('${CONSENT_KEY}') === 'accepted') {
    gtag('consent','update',{
      ad_storage:'granted',
      ad_user_data:'granted',
      ad_personalization:'granted',
      analytics_storage:'granted'
    });
  }
} catch (e) {}
(function(w,d,s,l,i){
  w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');
  `.trim();
}

/**
 * Script de inicio de GTM. Va en el <head>, lo más arriba posible, para que el
 * estado de consentimiento por defecto ("denied") quede fijado antes de que el
 * contenedor cargue ninguna etiqueta. Sin contenedor configurado no renderiza.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;
  return (
    <script id="gtm-init" dangerouslySetInnerHTML={{ __html: gtmInitScript(GTM_ID) }} />
  );
}
