import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { SocialProof } from '@/components/SocialProof'
import { HealthPositioning } from '@/components/HealthPositioning'
import { Modalidades } from '@/components/Modalidades'
import { Horarios } from '@/components/Horarios'
import { Diferenciais } from '@/components/Diferenciais'
import { Depoimentos } from '@/components/Depoimentos'
import { Galeria } from '@/components/Galeria'
import { Localizacao } from '@/components/Localizacao'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <HealthPositioning />
        <Modalidades />
        <Horarios />
        <Diferenciais />
        <Depoimentos />
        <Galeria />
        <Localizacao />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
