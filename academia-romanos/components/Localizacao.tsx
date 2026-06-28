import { MapPin, ParkingSquare, Clock, MessageCircle } from 'lucide-react'
import { Reveal } from './ui/Reveal'
import { InstagramIcon } from './ui/InstagramIcon'
import { WaButton } from './ui/WaButton'
import { SITE, WA_MESSAGES } from '@/lib/site'

export function Localizacao() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    SITE.mapsQuery
  )}&output=embed`

  return (
    <section id="contato" className="bg-base py-20 md:py-28">
      <div className="container-x">
        {/* CTA final */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="kicker mb-4 justify-center">Vamos começar?</p>
          <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
            O primeiro passo é só <span className="text-brand">um clique</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted">
            Manda uma mensagem agora. A gente responde, tira suas dúvidas e te ajuda a
            escolher por onde começar — sem compromisso e sem pressão.
          </p>
          <div className="mt-8 flex justify-center">
            <WaButton message={WA_MESSAGES.enroll} size="lg">
              <MessageCircle size={22} />
              Falar no WhatsApp agora
            </WaButton>
          </div>
        </Reveal>

        {/* Mapa + informações */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <Reveal className="overflow-hidden rounded-lg border border-white/10">
            <iframe
              title="Localização da Academia Romanos em Carapicuíba"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full lg:h-full lg:min-h-[420px]"
            />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-center gap-6">
            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-brand/15 text-brand">
                <MapPin size={22} aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-tight text-white">
                  Onde estamos
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {SITE.region} — {SITE.city}/{SITE.state}.
                  <br />
                  {SITE.address.street}{' '}
                  <span className="text-white/50">[CONFIRMAR endereço completo]</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-brand/15 text-brand">
                <ParkingSquare size={22} aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-tight text-white">
                  Estacionamento
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Vagas na avenida e na própria academia. Chegar e treinar com tranquilidade.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-brand/15 text-brand">
                <Clock size={22} aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-tight text-white">
                  Atendimento
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  WhatsApp: {SITE.whatsappDisplay}
                  <br />
                  Instagram:{' '}
                  <a
                    href={SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-white transition-colors hover:text-brand"
                  >
                    <InstagramIcon size={14} /> {SITE.instagramHandle}
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
