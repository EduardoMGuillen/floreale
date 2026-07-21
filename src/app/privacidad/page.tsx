import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND, CONTACT } from "@/lib/constants";

export default function PrivacidadPage() {
  return (
    <div className="bg-paper">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Legal
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Política de Privacidad
          </h1>
        </div>

        <article className="prose-brand mt-12 space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-display text-xl text-ink">1. Responsable del tratamiento</h2>
            <p>
              {BRAND} es responsable del tratamiento de los datos personales recogidos a través de este sitio web y de nuestros canales de comunicación (WhatsApp, correo electrónico).
            </p>
            <p>Contacto: <a href={`mailto:${CONTACT.email}`} className="text-brand hover:underline">{CONTACT.email}</a></p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">2. Datos que recopilamos</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Nombre y número de teléfono proporcionados voluntariamente al contactarnos por WhatsApp.</li>
              <li>Dirección de correo electrónico si nos contactas por email.</li>
              <li>Datos de navegación anónimos recopilados automáticamente (dirección IP, tipo de navegador, páginas visitadas).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">3. Finalidad del tratamiento</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Atender consultas y gestionar pedidos de arreglos florales.</li>
              <li>Mejorar nuestros productos y la experiencia del usuario en el sitio web.</li>
              <li>Enviar comunicaciones comerciales solo si el usuario ha dado su consentimiento.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">4. Cookies y tecnologías de seguimiento</h2>
            <p>Este sitio utiliza las siguientes tecnologías:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Google Analytics:</strong> para analizar el tráfico web de forma anónima y mejorar nuestro contenido.</li>
              <li><strong>Google AdSense:</strong> para mostrar anuncios relevantes; puede utilizar cookies para personalizar la publicidad.</li>
            </ul>
            <p>
              Puedes desactivar las cookies desde la configuración de tu navegador. Ten en cuenta que esto puede afectar la funcionalidad del sitio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">5. Conservación de datos</h2>
            <p>
              Los datos personales se conservarán únicamente durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos, o según lo requiera la legislación aplicable.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">6. Derechos del usuario</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Acceder a tus datos personales.</li>
              <li>Rectificar datos inexactos.</li>
              <li>Solicitar la eliminación de tus datos.</li>
              <li>Oponerte al tratamiento de tus datos.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, contáctanos en{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-brand hover:underline">{CONTACT.email}</a> o por WhatsApp al {CONTACT.phoneDisplay}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">7. Cambios en esta política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Cualquier cambio será publicado en esta página con la fecha de última actualización.
            </p>
          </section>

          <p className="pt-4 text-xs text-muted/70">Última actualización: julio 2026</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
