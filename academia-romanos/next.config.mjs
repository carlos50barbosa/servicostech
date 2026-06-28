/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Servido como static export sob um subpath pelo server.js central
  // (servicostech.com.br/academia-romanos). Mantenha o basePath em sincronia
  // com lib/base-path.ts.
  output: 'export',
  basePath: '/academia-romanos',
  trailingSlash: true,
  images: {
    // Sem o servidor de otimização do Next no export estático.
    unoptimized: true,
    // Os placeholders são SVG e o otimizador do next/image não processa SVG;
    // por isso esses <Image> usam a prop `unoptimized` (renderiza o arquivo direto).
    // Ao trocar pelos arquivos reais (JPG/PNG/WebP), remova `unoptimized` para
    // reativar a otimização automática.
    //
    // Para fotos hospedadas em outro domínio (ex.: Cloudinary/Unsplash), basta
    // adicionar o domínio em remotePatterns e usar a URL no next/image.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
