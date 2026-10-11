import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Delivery from "@/components/Delivery";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RoseLune | Floristería en El Progreso, Yoro — Flores a domicilio",
  description:
    "RoseLune, floristería en El Progreso, Yoro. Ramos, cajas, canastas, arreglos y globos con entrega a domicilio en El Progreso y San Pedro Sula.",
  alternates: {
    canonical: "/",
  },
};

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
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
