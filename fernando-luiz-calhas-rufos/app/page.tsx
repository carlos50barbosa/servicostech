import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Diferenciais from '@/components/Diferenciais';
import Servicos from '@/components/Servicos';
import Beneficios from '@/components/Beneficios';
import Sobre from '@/components/Sobre';
import Galeria from '@/components/Galeria';
import Depoimentos from '@/components/Depoimentos';
import AreaAtuacao from '@/components/AreaAtuacao';
import Faq from '@/components/Faq';
import Contato from '@/components/Contato';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollProgress from '@/components/ScrollProgress';

/**
 * Página inicial (single-page landing).
 * As seções são renderizadas na ordem definida no briefing.
 * Todo o conteúdo editável vem de lib/site-config.ts.
 */
export default function Home() {
  return (
    <>
      {/* Componentes globais fixos */}
      <ScrollProgress />
      <Header />
      <WhatsAppFloat />

      {/* Conteúdo principal */}
      <main>
        <Hero />
        <Diferenciais />
        <Servicos />
        <Beneficios />
        <Sobre />
        <Galeria />
        <Depoimentos />
        <AreaAtuacao />
        <Faq />
        <Contato />
      </main>

      <Footer />
    </>
  );
}
