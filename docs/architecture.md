# Código e arquitetura

## Stack real

Next.js 16.4.6 (App Router, Turbopack), React 19.3, TypeScript 6.0 estrito, Tailwind 4.3 (loader `@tailwindcss/turbopack`, sem PostCSS), shadcn/ui estilo `base-nova` + Lucide, Drizzle ORM 0.45 + PostgreSQL 18 via `pg`, Zod 4, Pino 10, Vitest 5, Prettier 3, ESLint 9. Node.js 26 LTS, npm (`package-lock.json`). Versões exatas: lockfile e `docs/setup.md`.

Exceções aos defaults do toolkit: npm em vez de pnpm (requisito do projeto); ESLint 9 e TypeScript 6.0 porque `eslint-config-next` e `typescript-eslint` ainda não aceitam ESLint 10/TypeScript 7 de forma estável (`typescript-eslint` exige `typescript <6.1`).

## Mapa do código

```text
src/
├── app/                      # rotas finas (App Router)
│   ├── layout.tsx, page.tsx, globals.css
│   └── api/health/route.ts   # liveness (healthcheck do Docker)
├── components/ui/            # componentes shadcn (somente button por ora)
├── lib/utils.ts              # cn() (clsx + tailwind-merge)
└── infrastructure/           # integrações, somente servidor
    ├── config/               # env-schema.ts (Zod), env.ts
    ├── logging/logger.ts     # Pino com redação de segredos
    └── db/                   # getDb()/closeDatabase(), schema/ (vazio)
scripts/                      # db-check.mjs, verify-quality-rules.mjs
eslint-rules/                 # regras `quality/*` do toolkit
compose.yaml, Dockerfile      # PostgreSQL local; imagem de produção
```

Não existem ainda `src/domains` nem `src/contracts`: são criados com o primeiro uso (não se criam camadas vazias).

## Limites e fluxo

Caminho de uma funcionalidade: rota/Server Action (`src/app`) → valida entrada com Zod (schema em `src/contracts`) → serviço (`src/domains/<feature>/*.service.ts`) → repository (`*.repository.ts`) → `getDb()` (`src/infrastructure/db`).

| Camada                      | Responsabilidade                                | Pode importar                 | Não pode                                                                                                                                   |
| --------------------------- | ----------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/app`, `src/components` | Apresentação, rotas finas                       | `domains`, `contracts`, `lib` | Cliente do banco (`quality/no-direct-data-access`)                                                                                         |
| `src/domains/<feature>`     | Regras, serviços, repositories                  | `contracts`, `infrastructure` | `next/*`, `@/app`, `@/components`; serviços e demais arquivos não importam `@/infrastructure/db` — só `*.repository.ts` ou `repositories/` |
| `src/infrastructure`        | Config/env, logger, banco, integrações externas | bibliotecas                   | Importar de `app`/`domains`                                                                                                                |
| `src/contracts`             | Tipos e schemas Zod compartilhados              | Zod                           | `next/*`, presentation                                                                                                                     |

Regras impostas por `eslint.config.mjs` (testadas com casos negativos; ver `docs/quality.md`). Código de servidor usa `server-only`.

## Dados e migrations

- Schema em `src/infrastructure/db/schema/index.ts` (vazio: nenhuma tabela inventada). SQL versionado em `drizzle/` quando houver schema.
- Ciclo: `npm run db:generate` → revisar SQL → `npm run db:migrate` só em destino autorizado. Nunca em build, import ou requisição. Sem `db:push`.
- `getDb()` cria um pool `pg` limitado (`max: 5`), reutilizável e preguiçoso: build e testes não precisam de banco. `DATABASE_URL_UNPOOLED` (opcional) tem prioridade nas migrations.
- `drizzle-kit migrate` registra o controle de migrations (`drizzle.__drizzle_migrations`) no banco; não cria tabelas de negócio.
- Ao dimensionar o pool para a hospedagem, considere instâncias simultâneas × `max`. Driver `pg` exige runtime Node.js (não Edge).

## Decisões

| Decisão                                              | Motivo                                                                        | Fonte/data                    | Revisitar quando                                 |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------ |
| `output: "standalone"`                               | Imagem Docker mínima e auto contida                                           | Next.js docs, 2026-11-11      | Hospedagem exigir outro formato                  |
| Tailwind por `@tailwindcss/turbopack` (sem PostCSS)  | Padrão do scaffold atual do Next 16.4; sem `postcss.config`                   | `create-next-app`, 2026-11-11 | Uso de webpack/rspack                            |
| `/api/health` só liveness                            | Healthcheck não pode derivar de dependência externa                           | —                             | Precisar de readiness com banco                  |
| Um `.env.local` para app, Drizzle, scripts e Compose | Fonte única; `${VAR}` expandido por Next/Drizzle/Compose                      | Teste local, 2026-11-11       | Segredos geridos por provedor                    |
| `shadcn` em `devDependencies`                        | Só fornece `shadcn/tailwind.css` e a CLI; mantém `npm audit --omit=dev` limpo | `npm audit`, 2026-11-11       | Remover `tw-animate-css` se não houver animações |
| Postgres 18 (`postgres:18-alpine`)                   | Última versão estável; 19 ainda em RC                                         | Docker Hub, 2026-11-11        | 19 estável                                       |

## Manutenção

Atualizar este mapa quando diretórios, dependências relevantes, contratos ou limites mudarem. Registrar apenas o que existe; planos ficam marcados como plano.
