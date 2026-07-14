"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo iniciar sesión");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-soft px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" aria-label={BRAND}>
            <Image
              src="/logo.png"
              alt={BRAND}
              width={200}
              height={64}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted">
            Acceso administración
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="border border-line bg-paper px-6 py-8 sm:px-8"
        >
          <h1 className="font-display text-2xl text-ink">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted">
            Administra arreglos, precios y promociones.
          </p>

          <label className="mt-8 block text-[11px] uppercase tracking-[0.14em] text-muted">
            Usuario
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            />
          </label>

          <label className="mt-5 block text-[11px] uppercase tracking-[0.14em] text-muted">
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-promo" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-pill mt-8 w-full disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            ← Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  );
}
