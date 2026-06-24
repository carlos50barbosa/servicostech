import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/basePath";

// Servido sob o domínio principal em servicostech.com.br/michelle-pedro-psicologa
// pelo server.js central, que entrega os arquivos estáticos gerados em out/.
// O basePath garante que os assets (/_next, imagens) resolvam sob esse prefixo.
const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
