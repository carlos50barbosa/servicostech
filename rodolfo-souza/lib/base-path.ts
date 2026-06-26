/**
 * Base path do site quando servido sob um subcaminho pelo server.js central
 * (servicostech.com.br/rodolfo-souza). Mantenha em sincronia com o `basePath`
 * do next.config.mjs.
 *
 * O Next já prefixa o basePath automaticamente em links internos, assets do
 * _next e next/image. Referências DIRETAS a arquivos de /public (favicon, etc.)
 * NÃO recebem o prefixo — use withBasePath() nesses casos.
 */
export const BASE_PATH = "/rodolfo-souza";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
