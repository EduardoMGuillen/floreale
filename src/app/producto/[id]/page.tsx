import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductById } from "@/lib/products";
import { whatsappBuyUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !product.active) notFound();

  return (
    <div className="botanical-wash">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <Link
          href="/#arreglos"
          className="text-sm text-muted transition hover:text-leaf"
        >
          ← Volver a arreglos
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.promo && (
              <span className="absolute left-4 top-4 bg-petal px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white">
                Promoción
              </span>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-sage">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-4xl text-leaf-deep sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-medium text-ink">
              L {product.price.toLocaleString("es-HN")}
            </p>
            <p className="mt-6 text-muted leading-relaxed">
              {product.description}
            </p>
            <a
              href={whatsappBuyUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-md bg-leaf px-6 py-3 text-sm font-medium text-white transition hover:bg-leaf-deep"
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
