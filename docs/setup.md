# Setup e evidências

## Origem e contexto

- Data da verificação: 2026-11-11.
- Toolkit: `soumatheusgomes/vibe-coding-toolkit`, revisão única `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f` (2026-11-08). O prompt foi lido de `docs/prompts/11-next-project-bootstrap.md` (a URL informada tinha `nextproject`; o arquivo real é `next-project`).
- Cliente: Claude Code, modelo da sessão (Sonnet 5.5), autenticação da sessão preservada; nenhuma delegação a outros modelos.
- Runtime: Node.js v26.13.0 (Lithium, LTS), npm 12.2.2, Docker 29.9.3, Compose v5.7.1, Linux.
- Projeto: "SaaS Template", sem descrição de produto fornecida; `PRODUCT.md` registra hipóteses e pendências.

## Decisões e fontes

| Decisão                                                                                                                                       | Motivo                                                                                                                                 | Fonte                         |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| npm + `package-lock.json`, Node 26 LTS em `.nvmrc`, `engines` (`>=26 <27`), Dockerfile (`NODE_VERSION=26`) e CI (`node-version-file: .nvmrc`) | Requisito do projeto; 26 é LTS desde 2026-10 (nodejs.org/dist/index.json)                                                              | nodejs.org, 2026-11-11        |
| Next 16.4.6 estável via `create-next-app@latest`                                                                                              | Canal estável do registro                                                                                                              | npm registry, 2026-11-11      |
| TypeScript 6.0.3 e ESLint 9.39.5                                                                                                              | `typescript-eslint@8.72.2` exige `typescript <6.1`; `eslint-config-next` aceita ESLint ≥9 mas o ecossistema do preset ainda é ESLint 9 | `npm view … peerDependencies` |
| `@types/node` 26                                                                                                                              | Alinhado ao runtime e aos peers do Vitest 5                                                                                            | npm registry                  |
| PostgreSQL 18                                                                                                                                 | 19 ainda RC                                                                                                                            | Docker Hub, 2026-11-11        |
| shadcn `base-nova` + Lucide                                                                                                                   | Requisito do projeto                                                                                                                   | `shadcn init -d`              |
| Fronteiras `domains/infrastructure/contracts` por ESLint                                                                                      | Requisito do projeto                                                                                                                   | `eslint.config.mjs`           |

Context7: consulta real feita (`/drizzle-team/drizzle-orm-docs`, `drizzle-kit migrate` com `dbCredentials.url`), coerente com `drizzle.config.ts`.

Correções ao scaffold/CLIs (observadas): `shadcn init` gerou `import { cn } from "cn"` e instalou o pacote `cn` (incorreto); substituído pelo `cn` local em `src/lib/utils.ts` e pacote removido. `--font-sans` ficou circular no CSS gerado; corrigido para `var(--font-geist-sans)`. O `next.config.ts` do scaffold foi sobrescrito por engano e o loader `@tailwindcss/turbopack` restaurado manualmente (sem ele o Tailwind não processava o CSS).

## Componentes

Versões: ver lockfile; principais: next 16.4.6, react 19.3.0, typescript 6.0.3, eslint 9.39.5, tailwindcss 4.3.3, vitest 5.1.0, drizzle-orm 0.45.4, drizzle-kit 0.31.11, pg 8.23.1, zod 4.6.7, pino 10.4.0, prettier 3.10.0, lucide-react 1.72.0, shadcn 4.23.0, PostgreSQL 18.6.

Skills de projeto instaladas com `npx skills@latest add … --agent codex claude-code --yes` (escopo projeto): `.agents/skills/` (canônico), `.claude/skills/` (links relativos), `skills-lock.json`. Sem sobreposição de nomes com as skills globais (`~/.agents/skills`, `~/.claude/skills`).

| Componente                                         | Ação e motivo                                                                                                  | Escopo          | Estado e evidência                                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skills web Vercel (8) + `find-skills`              | Instaladas conforme o catálogo atual (9 skills no upstream); `vercel-react-native-skills` omitida (sem mobile) | Projeto         | Instalado (`skills list` mostra Claude Code e Codex). Descoberta em sessão nova: **pendente**                                                       |
| `next-dev-loop`, `next-bundle-optimizer`           | Next 16 compatível                                                                                             | Projeto         | Instalado. Pré-requisitos de runtime (agent-browser, analyzer) **não verificados**                                                                  |
| `supabase-postgres-best-practices`                 | PostgreSQL em uso (provedor ainda não escolhido)                                                               | Projeto         | Instalado                                                                                                                                           |
| `shadcn`                                           | shadcn/ui adotado                                                                                              | Projeto         | Instalado; `components.json` presente                                                                                                               |
| `differential-review`                              | Revisões sensíveis à segurança                                                                                 | Projeto         | Instalado                                                                                                                                           |
| `gh-fix-ci`                                        | GitHub Actions + Codex (somente Codex)                                                                         | Projeto         | Instalado em `.agents/skills`; investigação real exige PR/execução (**pendente**)                                                                   |
| Sentry MCP                                         | Sem serviço escolhido                                                                                          | —               | Não configurado (pendente por decisão externa)                                                                                                      |
| Ponytail full, Caveman, Superpowers, RTK, Context7 | Reutilizados do cliente (hooks e plugins ativos nesta sessão)                                                  | Cliente/usuário | Ativos nesta sessão; nenhuma instalação global alterada                                                                                             |
| Graphify                                           | CLI global reutilizada; exclusões em `.graphifyignore`                                                         | Projeto         | `graphify extract . --code-only --no-cluster`: 246 nós, 336 arestas (`graphify-out/graph.json`, ignorado). Não cobre `PRODUCT.md`/semântica de docs |
| Harness (adaptação nativa)                         | Padrão do toolkit                                                                                              | Projeto         | Ver "Memória e harness"                                                                                                                             |

## Documentação criada

`PRODUCT.md`, `README.md`, `AGENTS.md` (bloco do Next preservado), `CLAUDE.md` (`@AGENTS.md`), `docs/architecture.md`, `docs/design.md`, `docs/onboarding.md`, `docs/quality.md`, `docs/setup.md`: conteúdo específico do projeto, sem placeholders. Diretório inicial vazio: nada consolidado.

## Verificações

| Item                                                                           | Estado                   | Evidência                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run check` (format, lint, typecheck, lint:typed, lint:rules, test, build) | Validado                 | Execução final verde; 9 testes em 4 arquivos; sem banco/credenciais                                                                                                                                                                                                                              |
| Regras de camadas ESLint                                                       | Validado                 | Casos negativos via `eslint --stdin`: `src/app` importando `@/infrastructure/db` falha; serviço de domínio importando db/`next/server` falha; `*.repository.ts` passa                                                                                                                            |
| Aplicação inicia                                                               | Validado                 | `next start` e `npm start` em portas livres: `GET /` 200 (título e `h1`), `GET /api/health` 200 `{"status":"ok"}`, CSS 200 e contém tokens                                                                                                                                                       |
| PostgreSQL local                                                               | Validado                 | `npm run db:up` → contêiner `healthy`; `npm run db:check` → `PostgreSQL 18.6`                                                                                                                                                                                                                    |
| Drizzle com `.env.local`                                                       | Validado                 | `db:generate`: "0 tables / nothing to migrate"; `db:migrate` conectou e terminou ("migrations applied") sem criar tabelas de negócio                                                                                                                                                             |
| Imagem Docker                                                                  | Validado                 | `docker compose … --profile app build app` e `up --wait`: contêiner `healthy`, `GET /` 200, `/api/health` ok, usuário `uid=1000(node)`, sem `POSTGRES_PASSWORD` no ambiente nem no histórico da imagem. Conexão ao banco **a partir da imagem** não exercitada (nenhum código usa o banco ainda) |
| Auditoria de produção                                                          | Validado                 | `npm audit --omit=dev`: 0 vulnerabilidades                                                                                                                                                                                                                                                       |
| Auditoria completa                                                             | Pendência registrada     | 16 avisos (2 baixos, 14 moderados) só em dev: `esbuild`/`@esbuild-kit` via `drizzle-kit`, `minimatch` via `typescript-eslint`/`shadcn`, `deepmerge` via `shadcn`. O "fix" oferecido é downgrade major (ex.: `drizzle-kit@0.18.1`); não aplicado                                                  |
| CI (GitHub Actions)                                                            | Configurado sem execução | `.github/workflows/ci.yml` com `actions/checkout@v7` e `actions/setup-node@v7` (últimas releases vistas: v7.0.1 e v7.1.0); sem remoto, primeira execução pendente                                                                                                                                |
| Revisão visual/leitor de tela                                                  | Não executada            | —                                                                                                                                                                                                                                                                                                |

Recursos temporários criados e encerrados: servidores `next start`/`npm start` nas portas 3917/3918, contêineres `db` e `app` (`compose down`, volume preservado), diretórios temporários do toolkit e do fixture de harness. Contêiner `db` está **parado**; suba com `npm run db:up`.

## Memória e harness

- Memória: canônica em documentos versionados (`AGENTS.md` → `PRODUCT.md`, `docs/*`); `CLAUDE.md` importa `AGENTS.md`. Claude Code também tem memória nativa por projeto (fora do repositório). Regra: memória durável cita fonte, data da última verificação e gatilho de invalidação; conflito com o código vence o código. Recuperação em contexto limpo: **não executada** (exigiria nova sessão).
- Harness (adaptação nativa, não o framework Harness2). Avaliador `scripts/validate-harness.mjs` (sha256 `14220a750afbcf22…`) executado contra o fixture intacto em cópia descartável: 5 de 7 passam e exatamente os 2 esperados falham (isolamento entre tenants; identidades inválidas), como exige o baseline. Casos que dependem de comportamento observado do agente (correção de fronteira, handoff obsoleto, revisão somente leitura, reaplicação, conflito de recursos, bloqueio parcial, pausa/retomada): **não executados**; nenhuma falha observada justificou comparar candidatas e nenhuma instrução funcional foi alterada.
- Revisão de segurança: bloco do prompt 13 registrado por fonte versionada em `docs/quality.md` (não executada nesta base).

## Pendências e próxima entrega

- Descrição do produto e fluxos (`PRODUCT.md`).
- Primeira execução do CI e remoto Git; decidir hospedagem e pooling.
- Validar descoberta das skills em sessão nova e recuperação de memória em contexto limpo.
- Pré-requisitos de `next-dev-loop`/`next-bundle-optimizer` (agent-browser, analyzer) não verificados.
- Remover os 5 SVGs não usados do scaffold em `public/` (remoção bloqueada pela sessão).
- Próxima tarefa do MVP: fluxo 1 (cadastro e login), com primeiro schema e primeira migration.
