"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/constants";

function BagIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden
    >
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

export default function Header({ blush = false }: { blush?: boolean }) {
  const [open, setOpen] = useState(false);
  const left = NAV_LINKS.slice(0, 2);
  const right = NAV_LINKS.slice(2);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line/80 ${
        blush ? "bg-blush/90 backdrop-blur-md" : "bg-paper/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto grid h-[4.5rem] max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-[5.25rem] sm:px-6 lg:px-8">
        <nav className="hidden items-center gap-7 md:flex">
          {left.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/75 transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="col-start-2 flex items-center justify-center"
          aria-label={BRAND}
        >
          <Image
            src="/logo.jpg"
            alt={BRAND}
            width={220}
            height={64}
            className="h-11 w-auto object-contain sm:h-14"
            priority
          />
        </Link>

        <div className="hidden items-center justify-end gap-7 md:flex">
          {right.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/75 transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#catalogo"
            aria-label="Ver catálogo"
            className="text-ink/80 transition hover:text-brand"
          >
            <BagIcon />
          </Link>
        </div>

        <button
          type="button"
          className="col-start-3 justify-self-end text-ink md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`h-px w-full bg-current transition ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-full bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-line bg-paper md:hidden"
          >
            <div className="flex flex-col px-4 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/80"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#sobre"
                className="px-2 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/80"
                onClick={() => setOpen(false)}
              >
                Sobre nosotros
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
