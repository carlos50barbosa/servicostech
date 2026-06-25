/** @type {import('next').NextConfig} */
// Servido sob o domínio principal em servicostech.com.br/luiz-gustavo-personal-trainer
// pelo server.js central, que entrega os arquivos estáticos gerados em out/.
// O basePath garante que os assets (/_next, imagens) resolvam sob esse prefixo.
// IMPORTANTE: mantenha o basePath em sincronia com BASE_PATH em lib/base-path.ts.
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/luiz-gustavo-personal-trainer',
  trailingSlash: true,
  images: {
    // Export estático não roda o otimizador de imagens do Next em runtime.
    unoptimized: true,
    // Permite que o next/image sirva os SVGs de placeholder (trocar pelas fotos
    // reais do Luiz). Ao usar fotos .jpg/.webp, estas linhas podem ser removidas.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
