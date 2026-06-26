import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Diferenciais } from "@/components/Diferenciais";
import { ComoFunciona } from "@/components/ComoFunciona";
import { Simulador } from "@/components/Simulador";
import { ParaQuemE } from "@/components/ParaQuemE";
import { Depoimentos } from "@/components/Depoimentos";
import { FAQ } from "@/components/FAQ";
import { Sobre } from "@/components/Sobre";
import { CTAFinal } from "@/components/CTAFinal";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

// Monta a landing page seção por seção, na ordem de conversão.
export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <Stats />
        <Diferenciais />
        <ComoFunciona />
        <Simulador />
        <ParaQuemE />
        <Depoimentos />
        <FAQ />
        <Sobre />
        <CTAFinal />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
