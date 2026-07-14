import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="botanical-wash">
      <Header />
      <main>
        <Hero />
        <Products products={products} />
        <About />
        <Testimonials />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
