import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConstructorClient from "@/components/ConstructorClient";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ConstructorPage() {
  const products = await getProducts();

  return (
    <div className="bg-paper">
      <Header />
      <main>
        <ConstructorClient products={products} />
      </main>
      <Footer />
    </div>
  );
}
