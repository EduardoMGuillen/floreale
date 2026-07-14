# Guía para replicar esta plantilla en otro proyecto o sector

Esta guía describe el **formato**, **stack** y **archivos a tocar** cuando clones el patrón de esta landing (Next.js + React + Tailwind + Framer Motion) para otro cliente o vertical. Incluye la variante **tienda / catálogo** con login administrativo y panel de productos (caso Floreale).

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** (paleta en `src/app/globals.css` con `@theme` / CSS variables; Tailwind v4)
- **Framer Motion** (animaciones ligeras al cargar y al hacer scroll)
- **`next/font`** (una fuente display + una sans)
- **`next/image`** para fotos (demo vía Unsplash en `lib/demo-images.ts`; sustituir en producción)
- **Auth básica** (cookie firmada + credenciales en `.env.local`)
- **Catálogo persistente** (`data/products.json` + API routes)
- **Checkout por WhatsApp** (`lib/whatsapp.ts`)

## Prompt maestro (copiar en Cursor u otro asistente)

```
Quiero una landing en Next.js (App Router) + React + TypeScript + Tailwind CSS + animaciones ligeras con Framer Motion, mismo patrón que una web de servicios profesionales premium.

Estructura obligatoria:
1) Header fijo: logo/nombre, navegación a anclas (#servicios, #sobre, #testimonios, #contacto), CTA principal, menú móvil.
2) Hero: titular en 2 líneas con acento en gradiente o color de marca, subtítulo, 2 botones (primario + secundario), bloque visual derecho (imagen optimizada con next/image o placeholder), 3 métricas o bullets de confianza.
3) Servicios: título de sección + grid de 4–6 tarjetas (icono, título, descripción corta), animación al entrar en viewport.
4) Sobre / propuesta de valor: 2 columnas (imagen + texto), lista con checks, opcional tarjeta flotante con dato clave.
5) Testimonios: 3 citas en cards con comillas y autor.
6) CTA final: banda con gradiente de marca, titular, texto corto, botones (tel/mail o formulario).
7) Footer: marca, descripción breve, enlaces rápidos, fila inferior con © año + enlace "Powered by Nexus Global" a https://www.nexusglobalsuministros.com/

Requisitos técnicos:
- Tipografías con next/font (una display + una sans).
- Paleta en globals.css (@theme / variables) o tailwind.config alineada al sector del cliente.
- dark: coherente con prefers-color-scheme.
- Imágenes demo solo de fuentes con licencia clara (Unsplash) en lib/demo-images.ts + remotePatterns en next.config; comentario de sustituir en producción.
- Textos en español, tono profesional; reemplazar marca de ejemplo por [NOMBRE CLIENTE].
- Componentes en /components, página principal ensambla secciones.
```

## Variante Floreale (floristería / catálogo + WhatsApp)

Además de la landing, esta plantilla incluye:

### Login administrativo

- Ruta pública: `/login` (`src/app/login/page.tsx`)
- API: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Cookie HTTP-only: `floreale_session` (nombre en `lib/constants.ts` → `AUTH_COOKIE`)
- Firmado HMAC en `lib/auth.ts` con `AUTH_SECRET`
- Credenciales: `ADMIN_USER` y `ADMIN_PASSWORD` en `.env.local`
- Middleware: protege `/dashboard` (`src/middleware.ts`)

### Panel / dashboard de productos

- Ruta: `/dashboard` (`src/app/dashboard/page.tsx` + `components/DashboardClient.tsx`)
- Acciones: crear, editar, eliminar productos; marcar/quitar **promoción**; ocultar/mostrar en tienda (`active`)
- Persistencia: `data/products.json` vía `lib/products.ts`
- API: `GET/POST /api/products`, `GET/PATCH/DELETE /api/products/[id]`
- Formulario responsive (móvil y desktop en dos columnas)

### Compra por WhatsApp

- Número: `NEXT_PUBLIC_WHATSAPP` (ej. `50493720140` → +504 9372-0140)
- Al hacer clic en **Comprar**, se abre `wa.me` con mensaje que incluye nombre, precio y **enlace** `/producto/[id]`
- Lógica en `lib/whatsapp.ts` → `whatsappBuyUrl()`
- Página de detalle: `src/app/producto/[id]/page.tsx` (para que la tienda identifique el producto)

### Variables de entorno

```
ADMIN_USER=admin
ADMIN_PASSWORD=floreale2024
AUTH_SECRET=cambia-este-secreto
NEXT_PUBLIC_WHATSAPP=50493720140
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

`NEXT_PUBLIC_SITE_URL` debe ser la URL pública en producción (sale en el mensaje de WhatsApp).

## Checklist al adaptar otro sector

| Qué cambiar | Archivo habitual |
|-------------|------------------|
| Título, descripción SEO | `app/layout.tsx` |
| Paleta de marca | `app/globals.css` (`:root` + `@theme`) |
| Navegación y CTA cabecera | `components/Header.tsx` |
| Titular, métricas, hero visual | `components/Hero.tsx` |
| Listado de servicios / catálogo | `components/Services.tsx` o `components/Products.tsx` |
| Historia, imagen lateral | `components/About.tsx` y `lib/demo-images.ts` |
| Testimonios | `components/Testimonials.tsx` |
| Contacto (tel, mail, WhatsApp) | `components/CtaBand.tsx` |
| Pie, enlaces, powered by | `components/Footer.tsx` |
| Orden de secciones | `app/page.tsx` |
| Credenciales admin | `.env.local` (`ADMIN_USER`, `ADMIN_PASSWORD`) |
| Login UI | `app/login/page.tsx` |
| Panel CRUD productos | `components/DashboardClient.tsx`, `app/dashboard/page.tsx` |
| Persistencia catálogo | `data/products.json`, `lib/products.ts`, `app/api/products/**` |
| Auth / cookie | `lib/auth.ts`, `app/api/auth/**`, `middleware.ts` |
| WhatsApp + mensaje de pedido | `lib/whatsapp.ts`, `lib/constants.ts` |
| URL pública (enlaces en chat) | `NEXT_PUBLIC_SITE_URL` en `.env.local` |
| Página producto (deep link) | `app/producto/[id]/page.tsx` |

## Imágenes de demostración

- URLs centralizadas en `lib/demo-images.ts` (hero / about).
- Productos demo también en `data/products.json` (Unsplash).
- Licencia Unsplash: <https://unsplash.com/license>
- Antes de producción: sustituir por fotos del cliente o stock con licencia explícita.
- **Logo Floreale:** pendiente; cuando exista, colocarlo en `public/` y usarlo en `Header.tsx` / `Footer.tsx`.

## Powered by Nexus Global

En el footer del template hay un enlace **Powered by Nexus Global** hacia:

<https://www.nexusglobalsuministros.com/>

Si reutilizas el footer en otro repo, conserva o adapta esa constante (`NEXUS_URL` en `components/Footer.tsx` / `lib/constants.ts`) según tu acuerdo comercial.

## Variante estilo “agencia” (tipo Nexus Global)

Si quieres acercarte a un sitio con **Proyectos**, **Proceso**, **Partners** y **formulario de contacto**, añade al prompt:

- Sección **Proyectos**: grid de casos con stack/tecnologías y enlace “Ver detalles”.
- Sección **Proceso**: pasos numerados (Descubrimiento → Diseño → Desarrollo → Lanzamiento) + bullets de compromiso.
- **Partners / logos**: carrusel o fila de logos en escala de grises.
- **Contacto**: formulario + email/redes; backend o servicio de envío según necesidad.

## Comandos útiles

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # comprobar que compila antes de desplegar
```

Accesos rápidos en local:

- Tienda: `/`
- Login: `/login` (usuario/contraseña de `.env.local`)
- Dashboard: `/dashboard`
