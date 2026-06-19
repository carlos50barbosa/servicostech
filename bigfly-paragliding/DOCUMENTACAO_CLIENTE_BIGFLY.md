# Documentação do Site — BigFly Paragliding

## 1. Apresentação do projeto

O site da BigFly Paragliding foi desenvolvido como uma página institucional para apresentar a empresa, divulgar os voos de parapente no Rio de Janeiro, transmitir confiança ao visitante e facilitar o contato para agendamento pelo WhatsApp.

A estrutura do site valoriza a experiência do voo, a segurança, o instrutor, a localização na Pedra Bonita, São Conrado e Praia do Pepino, além de exibir avaliações reais do Google e fotos dos voos.

## 2. Objetivo do site

O site tem como principais objetivos:

- Apresentar a empresa e o instrutor.
- Mostrar a experiência do voo de parapente.
- Destacar segurança e experiência profissional.
- Apresentar Pedra Bonita, Praia do Pepino e São Conrado.
- Exibir avaliações reais do Google.
- Gerar contatos pelo WhatsApp.
- Fortalecer a presença online da BigFly Paragliding.

## 3. Estrutura do site

O site foi organizado em seções para facilitar a navegação do visitante:

- **Início / Banner principal:** apresenta a BigFly Paragliding com imagens em destaque, chamada principal e botões de contato.
- **Sobre o instrutor:** apresenta Carlos Henrique e sua experiência no voo livre.
- **Por que escolher a BigFly:** destaca diferenciais da empresa e da experiência.
- **Pedra Bonita:** apresenta o local de decolagem e sua importância para o voo livre no Rio de Janeiro.
- **Rio de Janeiro visto do céu:** mostra os principais pontos que podem ser vistos durante o voo.
- **Como funciona a experiência:** explica as etapas do encontro, subida, orientação, voo, pouso e entrega das imagens.
- **Segurança:** reforça procedimentos, equipamentos e certificações.
- **Local de encontro:** informa a região da Praia do Pepino, em São Conrado.
- **Galeria / Momentos:** exibe fotos dos voos.
- **Avaliações no Google:** apresenta avaliações reais de clientes.
- **Dúvidas frequentes:** reúne respostas para perguntas comuns antes do voo.
- **Chamada final para agendamento:** reforça o convite para falar com a BigFly pelo WhatsApp.
- **Rodapé:** reúne contatos, links do menu, links legais e redes sociais.
- **Termos de Serviço:** página legal com condições gerais de uso e serviço.
- **Política de Privacidade:** página legal sobre privacidade e tratamento de dados.

## 4. Funcionalidades implementadas

Foram implementadas as seguintes funcionalidades:

- Site responsivo para computador, tablet e celular.
- Menu fixo no topo.
- Menu mobile com abertura, fechamento por botão e fechamento ao clicar fora.
- Slider automático de imagens no banner principal.
- Botões de agendamento via WhatsApp.
- Botão flutuante do WhatsApp.
- Suporte a três idiomas: português, inglês e espanhol.
- Seletor de idioma no cabeçalho com bandeiras.
- Avaliações reais do Google em formato de destaque/carrossel.
- Galeria de imagens com navegação por setas.
- FAQ / dúvidas frequentes expansível.
- Barra simples de aviso de cookies.
- Páginas de Termos de Serviço e Política de Privacidade.
- Estrutura preparada para SEO técnico.
- Metadados para Google e compartilhamento em redes sociais.
- Arquivos `sitemap.xml` e `robots.txt` para buscadores.

## 5. Idiomas

O site possui suporte a:

- Português.
- Inglês.
- Espanhol.

Os textos dos idiomas ficam organizados no arquivo:

`src/i18n/translations.js`

Quando houver alteração em textos principais do site, o ideal é atualizar as três versões de idioma para manter a experiência completa para visitantes brasileiros e estrangeiros.

## 6. Imagens do site

As imagens do site ficam organizadas dentro da pasta:

`assets/images/`

Essa pasta reúne imagens do slider, galeria, instrutor, Pedra Bonita, logos e certificações.

Recomendações para manutenção das imagens:

- Usar imagens de boa qualidade.
- Evitar imagens muito pesadas.
- Preferir formatos otimizados, como WebP, quando possível.
- Manter nomes de arquivos organizados.
- Não excluir imagens em uso sem atualizar o site.
- Ao trocar uma imagem, manter o mesmo nome do arquivo facilita a manutenção.

As imagens da galeria ficam em:

`assets/images/album/`

## 7. Avaliações do Google

A seção de avaliações exibe avaliações reais cadastradas no projeto.

Orientações:

- Não inserir avaliações falsas.
- Manter nome, nota e texto conforme a avaliação real do Google.
- O botão “Ver avaliações no Google” aponta para o perfil oficial da empresa no Google.
- Caso novas avaliações sejam adicionadas, a lista de avaliações deve ser atualizada no código.

As avaliações estão organizadas no arquivo:

`script.js`

## 8. WhatsApp

Os botões de contato do site levam o visitante para o WhatsApp da BigFly Paragliding.

Número configurado:

`+55 21 99246-5732`

A mensagem enviada pelo WhatsApp pode variar conforme o idioma selecionado no site.

## 9. SEO e presença no Google

O site foi preparado com boas práticas técnicas para presença orgânica, incluindo:

- Hierarquia de títulos.
- Meta title.
- Meta description.
- Canonical.
- Open Graph para compartilhamento em WhatsApp, Facebook e Instagram.
- Twitter Card.
- Texto alternativo em imagens.
- Estrutura responsiva.
- Conteúdo com termos locais relevantes, como Rio de Janeiro, Pedra Bonita, São Conrado e Praia do Pepino.
- Organização dos arquivos.
- `sitemap.xml`.
- `robots.txt`.
- Dados estruturados em JSON-LD para negócio/atividade local.

Importante: o site está preparado tecnicamente para presença orgânica, mas não existe garantia de posição no Google. O ranqueamento depende de diversos fatores, como concorrência, autoridade do domínio, conteúdo, backlinks, Google Meu Negócio, avaliações reais e tempo de indexação.

## 10. Cookies e privacidade

O site possui uma barra simples de aviso de cookies.

Informações importantes:

- O site atualmente não usa Google Analytics, Meta Pixel, Google Tag Manager ou ferramentas de rastreamento.
- A barra salva a escolha do usuário no próprio navegador.
- Caso ferramentas de rastreamento sejam adicionadas futuramente, elas deverão respeitar o consentimento do usuário.

## 11. Páginas legais

O site possui:

- Termos de Serviço.
- Política de Privacidade.

Observação: os textos legais devem ser revisados pelo cliente ou por um profissional jurídico caso o cliente queira uma versão totalmente personalizada e validada juridicamente.

## 12. Arquivos principais do projeto

Principais arquivos e pastas:

- `index.html`: página principal do site.
- `styles.css`: estilos visuais do site.
- `script.js`: funcionalidades interativas.
- `src/i18n/translations.js`: textos dos idiomas.
- `termos/index.html`: página de Termos de Serviço.
- `privacidade/index.html`: página de Política de Privacidade.
- `assets/images/`: imagens do site.
- `robots.txt`: orientação para mecanismos de busca.
- `sitemap.xml`: mapa do site para buscadores.

## 13. Manutenção futura

Exemplos de alterações que podem ser feitas futuramente:

- Trocar fotos do slider.
- Adicionar novas fotos na galeria.
- Atualizar avaliações do Google.
- Alterar telefone do WhatsApp.
- Atualizar textos.
- Alterar ou revisar traduções dos idiomas.
- Adicionar novas seções.
- Instalar Google Analytics, Meta Pixel ou Google Tag Manager.
- Criar novas páginas.
- Melhorar SEO com novos conteúdos.

## 14. Recomendações ao cliente

Para manter o site sempre relevante e atualizado, recomenda-se:

- Manter o Google Meu Negócio atualizado.
- Pedir novas avaliações reais aos clientes.
- Publicar fotos novas com frequência.
- Manter WhatsApp e Instagram atualizados.
- Evitar alterar arquivos técnicos sem orientação.
- Fazer backup antes de grandes mudanças.
- Usar imagens leves para não prejudicar a velocidade do site.
- Conferir periodicamente se telefone, links e informações de contato continuam corretos.

## 15. Checklist de entrega

Itens entregues no projeto:

- Site responsivo.
- Página principal.
- Slider de imagens.
- Botões de WhatsApp.
- Botão flutuante de WhatsApp.
- Galeria.
- Seção de segurança.
- Logos de certificações com links externos.
- Seção de avaliações reais do Google.
- FAQ / dúvidas frequentes.
- Suporte a três idiomas.
- Termos de Serviço.
- Política de Privacidade.
- Barra de cookies.
- SEO técnico básico.
- Metadados para redes sociais.
- JSON-LD para negócio/atividade local.
- `robots.txt`.
- `sitemap.xml`.
- Rodapé com contatos, menu e links legais.
- Organização de imagens e arquivos.

## 16. Informações de contato

Desenvolvido por: **Serviços Tech**

Site: https://servicostech.com.br/

