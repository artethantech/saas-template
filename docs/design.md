# Design e acessibilidade

## Direção

Público e tom definidos pelo produto (pendente, ver `PRODUCT.md`). Direção atual: interface em português do Brasil, mobile first, sóbria e neutra, com espaço para uma marca depois. Escuro ainda não é suportado (direção, não implementado).

## Sistema existente

- Tokens: variáveis CSS do shadcn (`--background`, `--primary`, `--ring`, `--radius` etc.) e mapeamento `@theme inline` em `src/app/globals.css`, cor base `neutral`. É a fonte única dos valores; não duplicar aqui.
- Tipografia: Geist Sans/Mono (`next/font/google`) em `src/app/layout.tsx`.
- Componentes: `src/components/ui/button.tsx` (shadcn, `@base-ui/react`). Novos componentes entram com `npx shadcn@latest add <nome>` apenas quando a tela precisar. Configuração em `components.json`.
- Ícones: Lucide (`lucide-react`), decorativos com `aria-hidden`.
- A classe `.dark` existe nos tokens, mas nada a aplica ainda.

## Interação

HTML semântico, navegação por teclado, foco visível, contraste adequado, controles e campos rotulados. Erros de validação ao lado do campo; operações assíncronas mostram progresso e resultado. Respeitar `prefers-reduced-motion`.

## Layout e revisão

- Página inicial: coluna única, `max-w-3xl`, gutters de 16px (`px-4`) no mobile e 24px a partir de `sm`; título escala de `text-3xl` a `sm:text-5xl`.
- Existe link "Pular para o conteúdo" (visível ao focar), um único `h1` e `main` com `id="conteudo"`.
- Estados de vazio, erro e carregamento: ainda não existem telas que os exijam.
- Revisão feita: leitura estática do markup e verificação HTTP (título, `h1`, CSS servido). Revisão visual em navegador e com leitor de tela: **não executada**.

## Manutenção

Mudanças visuais atualizam a fonte dos tokens/componentes e esta orientação quando uma regra mudar. Consultar `web-design-guidelines` e `shadcn` ao revisar UI.
