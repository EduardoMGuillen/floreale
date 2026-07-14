import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Delivery from "@/components/Delivery";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="bg-paper">
      <Header blush />
      <main>
        <Hero />
        <Products products={products} limit={6} seeAllHref="/productos" />
        <About />
        <Delivery />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
