import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactoContent from "./ContactoContent";

export const metadata: Metadata = {
  title: "Contacto | RoseLune — Floristería en Honduras",
  description:
    "Escríbenos por WhatsApp para pedir ramos, cajas, canastas, arreglos, globos y flores para eventos. Entrega en El Progreso, Yoro y San Pedro Sula, Honduras.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <div className="bg-paper">
      <Header />
      <ContactoContent />
      <Footer />
    </div>
  );
}
