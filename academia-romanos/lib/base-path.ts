/**
 * Base path do site quando servido sob um subcaminho pelo server.js central
 * (servicostech.com.br/academia-romanos). Mantenha em sincronia com o `basePath`
 * do next.config.mjs.
 *
 * O Next já prefixa o basePath automaticamente em links internos e assets do
 * _next. Referências DIRETAS a arquivos de /public (background-image em style
 * inline, next/image com src de /public, favicon, etc.) NÃO recebem o prefixo —
 * use withBasePath() nesses casos.
 */
export const BASE_PATH = "/academia-romanos";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
