// Prefixo sob o qual o site é publicado.
//
// Em produção, o site é servido pelo servidor central em
// servicostech.com.br/michelle-pedro-psicologa. Este valor é a ÚNICA fonte da
// verdade do prefixo: é importado por `next.config.ts` (como `basePath`) e usado
// por `withBasePath` para montar os caminhos das imagens de /public.
export const BASE_PATH = "/michelle-pedro-psicologa";

// Prefixa um caminho de /public (ex.: imagens) com o BASE_PATH.
//
// O componente <Image> do Next NÃO adiciona o basePath automaticamente ao `src`
// de arquivos públicos passados como string — só a assets internos (/_next).
// Por isso prefixamos manualmente os caminhos de imagem aqui.
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }
  return `${BASE_PATH}${path}`;
}
