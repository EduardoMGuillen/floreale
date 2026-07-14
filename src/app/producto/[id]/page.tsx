import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductById, getProducts } from "@/lib/products";
import { whatsappBuyUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !product.active) notFound();

  const related = (await getProducts())
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-paper">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
          <Link href="/#catalogo" className="hover:text-brand">
            Catálogo
          </Link>
          <span className="mx-2">/</span>
          <span>Producto</span>
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-square overflow-hidden bg-soft">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.promo && (
              <span className="absolute left-4 top-4 bg-promo px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                Promo
              </span>
            )}
          </div>

          <div>
            <div className="flex gap-3">
              {[product.image, product.image, product.image].map((src, i) => (
                <div
                  key={i}
                  className="relative h-16 w-16 overflow-hidden bg-soft sm:h-20 sm:w-20"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className={`object-cover ${i === 0 ? "ring-1 ring-ink" : "opacity-80"}`}
                  />
                </div>
              ))}
            </div>

            <h1 className="mt-8 font-display text-3xl text-ink sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              {product.description}
            </p>
            <p className="mt-6 text-xl text-ink">
              L {product.price.toLocaleString("es-HN")}
            </p>
            <a
              href={whatsappBuyUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill mt-8"
            >
              Comprar
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <h2 className="text-center font-display text-2xl text-ink sm:text-3xl">
              También te puede gustar
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {related.map((item) => (
                <Link key={item.id} href={`/producto/${item.id}`} className="group">
                  <div className="relative aspect-square overflow-hidden bg-soft">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <p className="text-sm text-ink">{item.name}</p>
                    <p className="shrink-0 text-sm text-ink/70">
                      L {item.price.toLocaleString("es-HN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/#catalogo" className="btn-pill">
                Ver todo
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
