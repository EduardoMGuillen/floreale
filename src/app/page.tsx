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
  title: "RoseLune | Floristería en Honduras — Ramos, Cajas, Arreglos y Eventos",
  description:
    "Floristería en Honduras con entrega en El Progreso, Yoro y San Pedro Sula. Ramos, cajas, canastas, arreglos, globos y flores para eventos. Pedidos por WhatsApp.",
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
