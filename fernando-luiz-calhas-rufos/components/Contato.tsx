'use client';

import { useState, type FormEvent } from 'react';
import { Phone, Instagram, MapPin, MessageSquareText } from 'lucide-react';
import Reveal from './Reveal';
import WhatsAppIcon from './icons/WhatsAppIcon';
import {
  contact,
  tiposDeServico,
  business,
  buildWhatsAppLink,
} from '@/lib/site-config';

/**
 * Contato — CTA final + formulário que monta a mensagem e abre o WhatsApp.
 *
 * Não há back-end: ao enviar, validamos os campos e abrimos
 * https://wa.me/<numero>?text=<mensagem-codificada> em uma nova aba.
 */

type FormState = {
  nome: string;
  telefone: string;
  servico: string;
  mensagem: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  nome: '',
  telefone: '',
  servico: '',
  mensagem: '',
};

export default function Contato() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});

  // Validação simples dos campos obrigatórios
  function validate(values: FormState): FormErrors {
    const next: FormErrors = {};
    if (!values.nome.trim()) next.nome = 'Informe seu nome.';
    // Aceita números com DDD (mínimo de 10 dígitos)
    const digits = values.telefone.replace(/\D/g, '');
    if (!digits) next.telefone = 'Informe seu telefone/WhatsApp.';
    else if (digits.length < 10) next.telefone = 'Telefone incompleto.';
    if (!values.servico) next.servico = 'Selecione um tipo de serviço.';
    return next;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpa o erro do campo assim que o usuário corrige
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    // Monta a mensagem com os dados do formulário
    const linhas = [
      'Olá! Vim pelo site e gostaria de solicitar um orçamento.',
      '',
      `*Nome:* ${form.nome}`,
      `*Telefone/WhatsApp:* ${form.telefone}`,
      `*Serviço:* ${form.servico}`,
    ];
    if (form.mensagem.trim()) linhas.push(`*Mensagem:* ${form.mensagem}`);

    const url = buildWhatsAppLink(linhas.join('\n'));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Classe base dos inputs
  const fieldClass =
    'w-full rounded-2xl border bg-white px-4 py-3 text-ink placeholder:text-muted/70 transition-colors focus:border-gold';

  return (
    <section id="contato" className="bg-white py-16 sm:py-24">
      <div className="container">
        <div className="grid gap-10 rounded-3xl bg-navy-gradient p-6 text-white shadow-soft-lg sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
          {/* Coluna esquerda: chamada + canais de contato */}
          <Reveal direction="right">
            <span className="eyebrow">Vamos conversar</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">
              Solicite seu orçamento sem compromisso
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-silver">
              Preencha o formulário e abriremos o WhatsApp com seus dados já
              prontos. Rápido, fácil e sem compromisso.
            </p>

            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href={`tel:${contact.phoneTel}`}
                  className="group flex items-center gap-4"
                  aria-label={`Ligar para ${contact.phoneDisplay}`}
                >
                  <span className="icon-circle h-12 w-12">
                    <Phone className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-silver">
                      Telefone
                    </span>
                    <span className="font-heading text-lg font-bold transition-colors group-hover:text-gold">
                      {contact.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4"
                  aria-label="Abrir conversa no WhatsApp"
                >
                  <span className="icon-circle h-12 w-12">
                    <WhatsAppIcon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-silver">
                      WhatsApp
                    </span>
                    <span className="font-heading text-lg font-bold transition-colors group-hover:text-gold">
                      {contact.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={contact.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4"
                  aria-label={`Instagram ${contact.instagram.handle}`}
                >
                  <span className="icon-circle h-12 w-12">
                    <Instagram className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-silver">
                      Instagram
                    </span>
                    <span className="font-heading text-lg font-bold transition-colors group-hover:text-gold">
                      {contact.instagram.handle}
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="icon-circle h-12 w-12">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-silver">
                    Atendimento
                  </span>
                  <span className="font-heading text-lg font-bold">
                    {business.region}
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>

          {/* Coluna direita: formulário */}
          <Reveal direction="left">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl bg-white p-6 text-ink shadow-soft sm:p-8"
              aria-label="Formulário de solicitação de orçamento"
            >
              <div className="space-y-5">
                {/* Nome */}
                <div>
                  <label
                    htmlFor="nome"
                    className="mb-1.5 block font-heading text-sm font-bold text-navy"
                  >
                    Nome <span className="text-gold-dark">*</span>
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? 'erro-nome' : undefined}
                    className={`${fieldClass} ${
                      errors.nome ? 'border-red-400' : 'border-silver/60'
                    }`}
                  />
                  {errors.nome && (
                    <p id="erro-nome" className="mt-1.5 text-sm text-red-500">
                      {errors.nome}
                    </p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="mb-1.5 block font-heading text-sm font-bold text-navy"
                  >
                    Telefone / WhatsApp <span className="text-gold-dark">*</span>
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    inputMode="tel"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(19) 99999-9999"
                    autoComplete="tel"
                    aria-required="true"
                    aria-invalid={!!errors.telefone}
                    aria-describedby={
                      errors.telefone ? 'erro-telefone' : undefined
                    }
                    className={`${fieldClass} ${
                      errors.telefone ? 'border-red-400' : 'border-silver/60'
                    }`}
                  />
                  {errors.telefone && (
                    <p id="erro-telefone" className="mt-1.5 text-sm text-red-500">
                      {errors.telefone}
                    </p>
                  )}
                </div>

                {/* Tipo de serviço */}
                <div>
                  <label
                    htmlFor="servico"
                    className="mb-1.5 block font-heading text-sm font-bold text-navy"
                  >
                    Tipo de serviço <span className="text-gold-dark">*</span>
                  </label>
                  <select
                    id="servico"
                    name="servico"
                    value={form.servico}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.servico}
                    aria-describedby={errors.servico ? 'erro-servico' : undefined}
                    className={`${fieldClass} ${
                      errors.servico ? 'border-red-400' : 'border-silver/60'
                    } ${form.servico ? 'text-ink' : 'text-muted/70'}`}
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    {tiposDeServico.map((tipo) => (
                      <option key={tipo} value={tipo} className="text-ink">
                        {tipo}
                      </option>
                    ))}
                  </select>
                  {errors.servico && (
                    <p id="erro-servico" className="mt-1.5 text-sm text-red-500">
                      {errors.servico}
                    </p>
                  )}
                </div>

                {/* Mensagem */}
                <div>
                  <label
                    htmlFor="mensagem"
                    className="mb-1.5 block font-heading text-sm font-bold text-navy"
                  >
                    Mensagem{' '}
                    <span className="font-normal text-muted">(opcional)</span>
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={form.mensagem}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Conte um pouco sobre o que você precisa..."
                    className={`${fieldClass} resize-none border-silver/60`}
                  />
                </div>

                <button type="submit" className="btn-whatsapp w-full">
                  <WhatsAppIcon className="h-5 w-5" />
                  Enviar pelo WhatsApp
                </button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
                  <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                  Ao enviar, abriremos o WhatsApp com sua mensagem pronta.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
