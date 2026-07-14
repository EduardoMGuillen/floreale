# Guía para replicar esta plantilla en otro proyecto o sector

Esta guía describe el **formato**, **stack** y **archivos a tocar** cuando clones el patrón de esta landing (Next.js + React + Tailwind + Framer Motion) para otro cliente o vertical. Incluye la variante **tienda / catálogo** con login administrativo y panel de productos (caso RoseLune).

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** (paleta en `src/app/globals.css` con `@theme` / CSS variables; Tailwind v4)
- **Framer Motion** (animaciones ligeras al cargar y al hacer scroll)
- **`next/font`** (una fuente display + una sans)
- **`next/image`** para fotos (demo vía Unsplash en `lib/demo-images.ts`; sustituir en producción)
- **Auth básica** (cookie firmada + credenciales en `.env.local`)
- **Catálogo persistente** (`lib/blob-store.ts` → Vercel Blob en producción; `data/products.json` en local)
- **Subida de imágenes** (`POST /api/upload` → Vercel Blob / `public/uploads` en local)
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

## Variante RoseLune (floristería / catálogo + WhatsApp)

Además de la landing, esta plantilla incluye:

### Persistencia en Vercel (Blob) — obligatorio

En Vercel **el sistema de archivos es efímero**: lo que escribas en `data/` o `public/uploads/` **no se guarda** entre requests. Por eso, sin Blob, parece que “no se eliminan” productos o “falla la subida de fotos”.

Esta plantilla usa **Vercel Blob** (`@vercel/blob`) vía `lib/blob-store.ts`:

| Entorno | Productos | Imágenes subidas |
|---------|-----------|------------------|
| **Vercel** (con token) | Blob `roselune/products.json` | Blob `roselune/uploads/…` |
| **Local** (sin token) | `data/products.json` | `public/uploads/` |

#### Pasos en el dashboard de Vercel

1. Abre el proyecto en [vercel.com](https://vercel.com).
2. Ve a **Storage** → **Create** → **Blob**.
3. Crea el store y **Connect** / enlázalo al proyecto (Production y Preview).
4. Vercel conecta el store al proyecto. En Env Variables deberías ver al menos:
   - **`BLOB_STORE_ID`** (actual; autentica con OIDC en Vercel)
   - a veces `BLOB_WEBHOOK_PUBLIC_KEY` (webhooks; no es necesario para esta app)
   - a veces también `BLOB_READ_WRITE_TOKEN` (token estático opcional)
5. Confirma en **Settings → Environment Variables** que `BLOB_STORE_ID` (o `BLOB_READ_WRITE_TOKEN`) esté en Production y Preview.
6. También configura el resto de variables (ver abajo).
7. Haz un **Redeploy** para que carguen las variables.

Con `BLOB_STORE_ID` basta en Vercel (el SDK usa OIDC automáticamente). `BLOB_WEBHOOK_PUBLIC_KEY` puedes ignorarlo para RoseLune.

**Importante:** el Blob debe ser de acceso **Public** para que las fotos del catálogo se vean en la tienda.

Sin `BLOB_STORE_ID` ni `BLOB_READ_WRITE_TOKEN` en Production, el admin fallará al guardar, borrar o subir imágenes.

#### Archivos clave

- `src/lib/blob-store.ts` — lectura/escritura Blob + fallback local  
- `src/lib/products.ts` — CRUD del catálogo  
- `src/app/api/upload/route.ts` — subida de fotos (comprimidas en el navegador antes)  
- `data/products.json` — semilla inicial (demo); en Vercel se copia a Blob la primera vez si aún no existe el archivo en Blob  

### Login administrativo

- Ruta pública: `/login` (`src/app/login/page.tsx`)
- API: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Cookie HTTP-only: `roselune_session` (nombre en `lib/constants.ts` → `AUTH_COOKIE`)
- Firmado HMAC en `lib/auth.ts` con `AUTH_SECRET`
- Credenciales: `ADMIN_USER` y `ADMIN_PASSWORD` (`.env.local` / Vercel Env)
- Middleware: protege `/dashboard` (`src/middleware.ts`)

### Panel / dashboard de productos

- Ruta: `/dashboard` (`src/app/dashboard/page.tsx` + `components/DashboardClient.tsx`)
- Acciones: crear, editar, eliminar (optimista), marcar/quitar **promoción**, ocultar/mostrar (`active`)
- Imagen: comprimir en el cliente → `POST /api/upload` → URL pública (Blob en Vercel)
- También se puede pegar una URL manual de imagen
- API: `GET/POST /api/products`, `GET/PATCH/DELETE /api/products/[id]`, `POST /api/upload`
- Formulario responsive (móvil y desktop)

### Compra por WhatsApp

- Número: `NEXT_PUBLIC_WHATSAPP` (ej. `50493720140` → +504 9372-0140)
- Al hacer clic en **Comprar**, se abre `wa.me` con mensaje que incluye nombre y **enlace** `/producto/[id]`
- Lógica en `lib/whatsapp.ts` → `whatsappBuyUrl()`
- Página de detalle: `src/app/producto/[id]/page.tsx`
- Listado completo: `/productos`

### Variables de entorno

```
ADMIN_USER=admin
ADMIN_PASSWORD=roselune2024
AUTH_SECRET=cambia-este-secreto
NEXT_PUBLIC_WHATSAPP=50493720140
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app

# Blob en Vercel (cualquiera de estos basta):
# BLOB_STORE_ID=store_...          ← lo crea Vercel al conectar Blob (OIDC)
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...  ← opcional / local
# BLOB_WEBHOOK_PUBLIC_KEY=...      ← lo puedes ignorar
```

- `NEXT_PUBLIC_SITE_URL` = URL pública (sale en el mensaje de WhatsApp).  
- `BLOB_STORE_ID` = ID del store Blob (suficiente en Vercel con OIDC).  
- `BLOB_READ_WRITE_TOKEN` = token estático opcional (útil en local con `vercel env pull`).  
- `BLOB_WEBHOOK_PUBLIC_KEY` = no lo usa esta plantilla.  
- Plantilla de ejemplo: `.env.example`

## Checklist al adaptar otro sector

| Qué cambiar | Archivo habitual |
|-------------|------------------|
| Título, descripción SEO | `app/layout.tsx` |
| Paleta de marca (blanco / rosado / negro / gris) | `app/globals.css` (`:root` + `@theme`) |
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
| Subida de imágenes | `app/api/upload/route.ts`, `lib/compress-image.ts`, `lib/blob-store.ts` |
| Persistencia catálogo | `lib/blob-store.ts`, `lib/products.ts`, `app/api/products/**` (+ Blob en Vercel) |
| Token / store Blob (Vercel) | Env `BLOB_STORE_ID` y/o `BLOB_READ_WRITE_TOKEN` (Storage → Blob) |
| Auth / cookie | `lib/auth.ts`, `app/api/auth/**`, `middleware.ts` |
| WhatsApp + mensaje de pedido | `lib/whatsapp.ts`, `lib/constants.ts` |
| URL pública (enlaces en chat) | `NEXT_PUBLIC_SITE_URL` |
| Página producto (deep link) | `app/producto/[id]/page.tsx` |
| Todos los productos | `app/productos/page.tsx` |

## Imágenes de demostración

- URLs centralizadas en `lib/demo-images.ts` (hero / about).
- Productos demo también en `data/products.json` (Unsplash).
- Licencia Unsplash: <https://unsplash.com/license>
- Antes de producción: sustituir por fotos del cliente o stock con licencia explícita.
- **Logo RoseLune:** `public/logo.png` — usado en `Header.tsx`, `Footer.tsx`, login y dashboard.
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
