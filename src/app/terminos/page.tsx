import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Términos y Condiciones | ${BRAND}`,
  description: `Términos y condiciones de uso del sitio web y servicio de ${BRAND}.`,
};

export default function TerminosPage() {
  return (
    <div className="bg-paper">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
          Legal
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Términos y Condiciones
        </h1>
        <p className="mt-2 text-sm text-muted">Última actualización: julio 2026</p>

        <div className="prose-sm prose-neutral mt-10 max-w-none space-y-6 text-sm leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-ink">
          <h2>1. Generalidades</h2>
          <p>
            Al acceder y utilizar el sitio web roselunehn.com (el &quot;Sitio&quot;), operado por {BRAND},
            aceptas los presentes Términos y Condiciones. Si no estás de acuerdo, te pedimos que
            no utilices el Sitio.
          </p>

          <h2>2. Productos y disponibilidad</h2>
          <p>
            Las imágenes y descripciones de los arreglos florales son orientativas. Debido a la
            naturaleza de las flores frescas, los colores, tamaños y variedades pueden variar
            según la temporada y disponibilidad. Nos comprometemos a mantener la esencia del
            diseño seleccionado.
          </p>

          <h2>3. Pedidos y confirmación</h2>
          <p>
            Los pedidos se realizan a través de WhatsApp o correo electrónico. Un pedido se
            considera confirmado una vez que recibes nuestra respuesta con los detalles de
            disponibilidad, precio y fecha de entrega. Nos reservamos el derecho de rechazar
            pedidos cuando no sea posible cumplir con los requisitos solicitados.
          </p>

          <h2>4. Precios y pagos</h2>
          <p>
            Todos los precios están expresados en Lempiras hondureños (HNL) e incluyen impuestos
            aplicables salvo que se indique lo contrario. Los métodos de pago aceptados se
            comunicarán al momento de confirmar el pedido.
          </p>

          <h2>5. Entregas</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Las entregas se realizan en la zona de cobertura indicada en el Sitio.</li>
            <li>
              Los tiempos de entrega son estimados y pueden variar según la demanda y condiciones
              externas.
            </li>
            <li>
              Si el destinatario no se encuentra disponible, intentaremos contactar al remitente
              para coordinar una nueva entrega.
            </li>
          </ul>

          <h2>6. Cancelaciones y cambios</h2>
          <p>
            Puedes cancelar o modificar un pedido contactándonos antes de que se inicie la
            preparación del arreglo. Una vez preparado, no se aceptan cancelaciones ni
            devoluciones dada la naturaleza perecedera del producto.
          </p>

          <h2>7. Propiedad intelectual</h2>
          <p>
            Todo el contenido del Sitio — textos, imágenes, logotipos y diseño — es propiedad de
            {BRAND} o se utiliza con autorización. Queda prohibida su reproducción sin
            consentimiento previo por escrito.
          </p>

          <h2>8. Limitación de responsabilidad</h2>
          <p>
            {BRAND} no será responsable por daños indirectos derivados del uso del Sitio o de la
            imposibilidad de acceder a él. No garantizamos la disponibilidad ininterrumpida del
            servicio.
          </p>

          <h2>9. Publicidad de terceros</h2>
          <p>
            El Sitio puede mostrar anuncios de terceros proporcionados por Google AdSense. No
            controlamos el contenido de dichos anuncios y no somos responsables de los productos
            o servicios anunciados por terceros.
          </p>

          <h2>10. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los
            cambios serán efectivos desde su publicación en el Sitio.
          </p>

          <h2>11. Contacto</h2>
          <p>
            Para cualquier consulta sobre estos Términos, escríbenos a{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-brand hover:underline">
              {CONTACT.email}
            </a>{" "}
            o al {CONTACT.phoneDisplay}.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
