// Prefixo sob o qual o site é publicado.
//
// Em produção, o site é servido pelo servidor central em
// servicostech.com.br/luiz-gustavo-personal-trainer. Mantenha este valor em
// sincronia com `basePath` em next.config.mjs.
export const BASE_PATH = '/luiz-gustavo-personal-trainer';

// Prefixa um caminho de /public (ex.: imagens) com o BASE_PATH.
//
// O componente <Image> do Next NÃO adiciona o basePath automaticamente ao `src`
// de arquivos públicos passados como string — só a assets internos (/_next).
// Por isso prefixamos manualmente os caminhos de imagem aqui.
export function withBasePath(path: string): string {
  if (!path.startsWith('/')) {
    return path;
  }
  return `${BASE_PATH}${path}`;
}
