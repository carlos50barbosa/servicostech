import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Beneficios from "@/components/Beneficios";
import ParaQuem from "@/components/ParaQuem";
import Servicos from "@/components/Servicos";
import ComoFunciona from "@/components/ComoFunciona";
import FraseImpacto from "@/components/FraseImpacto";
import Depoimentos from "@/components/Depoimentos";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Beneficios />
        <ParaQuem />
        <Servicos />
        <ComoFunciona />
        <FraseImpacto />
        <Depoimentos />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsappFloat />
    </>
  );
}
