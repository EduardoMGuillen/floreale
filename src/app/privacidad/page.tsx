import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Política de Privacidad | ${BRAND}`,
  description: `Política de privacidad y tratamiento de datos personales de ${BRAND}.`,
};

export default function PrivacidadPage() {
  return (
    <div className="bg-paper">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
          Legal
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-muted">Última actualización: julio 2026</p>

        <div className="prose-sm prose-neutral mt-10 max-w-none space-y-6 text-sm leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-ink">
          <h2>1. Responsable del tratamiento</h2>
          <p>
            {BRAND} (&quot;nosotros&quot;) opera el sitio web roselunehn.com. Puedes contactarnos
            en <a href={`mailto:${CONTACT.email}`} className="text-brand hover:underline">{CONTACT.email}</a> o
            al {CONTACT.phoneDisplay}.
          </p>

          <h2>2. Datos que recopilamos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Datos de contacto:</strong> nombre, teléfono y dirección de entrega que nos
              proporcionas al realizar un pedido por WhatsApp o correo electrónico.
            </li>
            <li>
              <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas
              visitadas y tiempo de permanencia, recopilados de forma automática mediante cookies
              y tecnologías similares.
            </li>
          </ul>

          <h2>3. Cookies y tecnologías de seguimiento</h2>
          <p>Utilizamos las siguientes herramientas de terceros que colocan cookies en tu dispositivo:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Google Analytics (G-Z7P7YCK44P):</strong> analiza el tráfico del sitio de
              forma agregada para mejorar nuestro contenido y experiencia de usuario.
            </li>
            <li>
              <strong>Google AdSense:</strong> muestra anuncios personalizados según tus intereses.
              Google y sus socios pueden utilizar cookies para mostrar anuncios relevantes.
            </li>
          </ul>
          <p>
            Puedes gestionar o desactivar cookies desde la configuración de tu navegador. Ten en
            cuenta que al desactivarlas es posible que algunas funciones del sitio no estén
            disponibles.
          </p>

          <h2>4. Finalidad del tratamiento</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Procesar y coordinar la entrega de pedidos.</li>
            <li>Responder consultas y brindar atención al cliente.</li>
            <li>Mejorar el sitio web y la experiencia de navegación.</li>
            <li>Mostrar publicidad relevante a través de Google AdSense.</li>
          </ul>

          <h2>5. Compartición de datos</h2>
          <p>
            No vendemos ni compartimos tus datos personales con terceros salvo los proveedores de
            servicios necesarios para operar el sitio (Google Analytics, Google AdSense) y los
            servicios de mensajería (WhatsApp) que utilizas voluntariamente para contactarnos.
          </p>

          <h2>6. Retención de datos</h2>
          <p>
            Conservamos tus datos de contacto mientras sea necesario para completar tu pedido y
            durante el plazo legal aplicable. Los datos de navegación se retienen de acuerdo con
            las políticas de Google Analytics.
          </p>

          <h2>7. Tus derechos</h2>
          <p>
            Puedes solicitar el acceso, rectificación o eliminación de tus datos personales
            escribiéndonos a{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-brand hover:underline">
              {CONTACT.email}
            </a>
            . Atenderemos tu solicitud en un plazo razonable.
          </p>

          <h2>8. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política periódicamente. La fecha de la última actualización
            aparece al inicio de esta página.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
