import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/components/Products";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <div className="bg-paper">
      <Header />
      <main>
        <div className="border-b border-line bg-blush/40 px-4 py-12 text-center sm:px-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Catálogo
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Todos los productos
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Explora el catálogo completo de RoseLune y pide el tuyo por WhatsApp.
          </p>
        </div>
        <Products
          products={products}
          title="Catálogo completo"
          sectionId="todos"
          seeAllHref={undefined}
        />
      </main>
      <Footer />
    </div>
  );
}
