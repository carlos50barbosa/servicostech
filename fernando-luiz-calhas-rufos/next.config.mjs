/** @type {import('next').NextConfig} */
// Servido sob o domínio principal em servicostech.com.br/fernando-luiz-calhas-rufos
// pelo server.js central, que entrega os arquivos estáticos gerados em out/.
// O basePath garante que os assets (/_next, imagens) resolvam sob esse prefixo.
// IMPORTANTE: mantenha o basePath em sincronia com BASE_PATH em lib/base-path.ts.
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/fernando-luiz-calhas-rufos',
  trailingSlash: true,
  images: {
    // Export estático não roda o otimizador de imagens do Next em runtime.
    unoptimized: true,
    // Permite usar SVGs (placeholders) com o componente next/image.
    // Ao trocar pelos arquivos reais (JPG/PNG/WebP), substitua em /public/images.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
