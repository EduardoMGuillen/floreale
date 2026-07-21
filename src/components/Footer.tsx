import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND, CONTACT, NAV_LINKS, NEXUS_URL } from "@/lib/constants";

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center text-ink/70 transition hover:text-brand"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14 text-center sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col items-center" aria-label={BRAND}>
          <Image
            src="/logo.png"
            alt={BRAND}
            width={200}
            height={64}
            className="h-14 w-auto object-contain"
          />
        </Link>

        <nav className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link
            href="/#sobre"
            className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-brand"
          >
            Sobre nosotros
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 space-y-1 text-sm text-muted">
          <p>
            <a href={CONTACT.phoneHref} className="hover:text-brand">
              {CONTACT.phoneDisplay}
            </a>
          </p>
          <p>
            <a href={`mailto:${CONTACT.email}`} className="hover:text-brand">
              {CONTACT.email}
            </a>
          </p>
          <p>{CONTACT.address}</p>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link
            href="/contacto"
            className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-brand"
          >
            Contacto
          </Link>
          <Link
            href="/privacidad"
            className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-brand"
          >
            Privacidad
          </Link>
        </nav>

        <div className="mt-8 flex items-center gap-2">
          <SocialIcon label="Instagram" href="https://instagram.com">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
            </svg>
          </SocialIcon>
          <SocialIcon label="Facebook" href="https://facebook.com">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
            </svg>
          </SocialIcon>
          <SocialIcon label="TikTok" href="https://tiktok.com">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M19 8.2a6.6 6.6 0 0 1-3.8-1.2v7.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.8 2.8 0 1 0 2 2.7V2h2.7a6.6 6.6 0 0 0 3.8 3.7v2.5z" />
            </svg>
          </SocialIcon>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {BRAND}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacidad" className="hover:text-brand">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-brand">
              Términos
            </Link>
            <Link href="/contacto" className="hover:text-brand">
              Contacto
            </Link>
            <Link href="/login" className="hover:text-brand">
              Admin
            </Link>
            <a
              href={NEXUS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              Powered by Nexus Global
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
