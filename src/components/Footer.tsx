import Link from "next/link";
import { BRAND, NEXUS_URL } from "@/lib/constants";

const quick = [
  { href: "#arreglos", label: "Arreglos" },
  { href: "#sobre", label: "Sobre nosotros" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#contacto", label: "Contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-leaf/10 bg-mist/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl text-leaf-deep">{BRAND}</p>
          <p className="mt-3 max-w-sm text-sm text-muted leading-relaxed">
            Floristería con arreglos frescos y detalles hechos a mano. Logo
            pendiente de agregar.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Enlaces rápidos</p>
          <ul className="mt-4 space-y-2">
            {quick.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted hover:text-leaf">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/login" className="text-sm text-muted hover:text-leaf">
                Acceso administración
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-leaf/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {BRAND}. Todos los derechos reservados.
          </p>
          <a
            href={NEXUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-leaf"
          >
            Powered by Nexus Global
          </a>
        </div>
      </div>
    </footer>
  );
}
