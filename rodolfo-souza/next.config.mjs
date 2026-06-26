/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Servido como static export sob um subpath pelo server.js central
  // (servicostech.com.br/rodolfo-souza). Mantenha o basePath em sincronia
  // com lib/base-path.ts.
  output: "export",
  basePath: "/rodolfo-souza",
  trailingSlash: true,
  images: {
    // Sem o servidor de otimização do Next no export estático.
    unoptimized: true,
  },
};

export default nextConfig;
