"use client";

import { FormEvent, useState } from "react";
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
    <div className="botanical-wash flex min-h-[100svh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-3xl text-leaf-deep transition hover:text-leaf"
          >
            {BRAND}
          </Link>
          <p className="mt-2 text-sm text-muted">Acceso al panel de productos</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="border border-leaf/15 bg-paper/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
        >
          <h1 className="font-display text-2xl text-leaf-deep">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted">
            Administra arreglos, precios y promociones.
          </p>

          <label className="mt-6 block text-sm text-ink">
            Usuario
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1.5 w-full rounded-md border border-leaf/20 bg-white px-3 py-2.5 text-sm outline-none ring-leaf/30 focus:ring-2 dark:bg-leaf-deep/40"
            />
          </label>

          <label className="mt-4 block text-sm text-ink">
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 w-full rounded-md border border-leaf/20 bg-white px-3 py-2.5 text-sm outline-none ring-leaf/30 focus:ring-2 dark:bg-leaf-deep/40"
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-petal" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-leaf py-2.5 text-sm font-medium text-white transition hover:bg-leaf-deep disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="hover:text-leaf">
            ← Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  );
}
