<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SaaS Template

## Produto e stack

- Produto e escopo: `PRODUCT.md`. Estrutura e decisões: `docs/architecture.md`. Evidências e versões: `docs/setup.md`.
- Stack: Next.js 16 (App Router), React 19, TypeScript 6, Tailwind 4, shadcn/ui (base-nova) + Lucide, Drizzle ORM + PostgreSQL (`pg`), Zod, Pino, Vitest, Prettier. Node.js LTS 26 (`.nvmrc`), npm com `package-lock.json`.

## Comandos canônicos

- Instalar: `npm ci`
- Desenvolver: `npm run dev` (PostgreSQL local antes: `npm run db:up`)
- Formatação: `npm run format` / `npm run format:check`
- Lint: `npm run lint`; tipado: `npm run lint:typed`; regras locais: `npm run lint:rules`
- Tipos: `npm run typecheck`
- Testes: `npm test`
- Build: `npm run build`
- Verificar a base (sem banco nem credenciais): `npm run check`
- Banco: `npm run db:up` · `db:down` · `db:check` · `db:generate` · `db:migrate`
- Imagem de produção contra o banco local: `npm run docker:app`

## Acordos de trabalho

- Leia o código e as instruções relevantes antes de editar. Declare premissas que afetam comportamento ou escopo.
- Menor mudança suficiente; reutilize padrões, componentes e dependências existentes. Sem abstrações, opções ou dependências para necessidades não pedidas.
- Preserve alterações locais, validação, tratamento de erros, segurança, acessibilidade e requisitos explícitos.
- Não transforme hipóteses em fatos nem integrações pendentes em resultados simulados.
- Publicar, enviar mensagens, custos e ações destrutivas exigem autorização específica. Instalar ferramenta não autoriza.
- Continue trabalho autorizado; um bloqueio interrompe só o que depende dele. Não repita tentativa idêntica sem evidência nova.

## Organização do código (resumo; detalhes em `docs/architecture.md`)

- `src/app`: rotas finas (validar entrada, chamar serviço, responder). Sem regra de negócio nem acesso ao banco.
- `src/domains/<feature>`: regras e serviços independentes do Next.js; acesso a dados só por repositories (`*.repository.ts`).
- `src/infrastructure`: integrações (config/env, logging, db). Só código de servidor.
- `src/contracts`: tipos/schemas Zod compartilhados entre camadas.
- Esses limites são impostos por ESLint (`eslint.config.mjs`). Não crie diretórios vazios; crie a camada quando o primeiro uso existir.
- Banco: um ponto de conexão (`src/infrastructure/db`), pool limitado e preguiçoso. Gere (`db:generate`), revise o SQL e aplique (`db:migrate`) apenas em destino autorizado; nunca migrar em build ou requisição; sem `db:push`.
- Valide entrada e ambiente com Zod; logue com Pino sem segredos. Segredos nunca em `NEXT_PUBLIC_*`.
- Variáveis: `.env.example` (versionado) → `.env.local` (ignorado). Ver `docs/onboarding.md`.

## Ferramentas e estilo

- **Ponytail** `full` para programação; **Caveman** só na conversa (código, docs e commits em redação normal); **Superpowers** proporcional ao escopo; **Context7** para APIs/bibliotecas, sem segredos nas consultas; **RTK** com comandos suportados, sem duplo wrapper; **Graphify** com grafo existente (`graphify-out/`, ignorado pelo Git).
- Preserve cliente, modelo e autenticação da sessão, inclusive Graphify/Caveman. Não troque provedor nem habilite API paga ou proxy.
- Verifique instalação e descoberta antes de depender de uma ferramenta.

## Skills do projeto (`.agents/skills/`, fontes em `skills-lock.json`)

`vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines` (revisar UI antes de concluir), `writing-guidelines` (revisar docs), `vercel-react-view-transitions`, `vercel-optimize`, `deploy-to-vercel`, `vercel-cli-with-tokens`, `find-skills`, `next-dev-loop`, `next-bundle-optimizer`, `supabase-postgres-best-practices` (antes de schema/SQL/migration), `shadcn` (antes de mexer em componentes/tokens), `differential-review` (mudanças sensíveis à segurança), `gh-fix-ci` (Codex + GitHub Actions). Instalar não executa ações; deploy só sob pedido.

## Git e colaboração

- Sem bloqueios de push em `main`, exigência de branch/worktree nem hooks pre-commit/pre-push por padrão.
- Revisão de segurança: ver `docs/quality.md`.
