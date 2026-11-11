# Preparação local

## Pré-requisitos

- Node.js 26 LTS (`.nvmrc`; `engines` exige `>=26 <27`) e npm. Com nvm: `nvm use`.
- Docker com Compose v2 (para o PostgreSQL local e a imagem de produção).
- Reutilize ferramentas globais; não copie caches de outra pessoa.

## Primeira execução

```bash
npm ci
cp .env.example .env.local     # edite POSTGRES_PASSWORD (qualquer valor local; sem caracteres especiais de URL)
npm run db:up                  # sobe o PostgreSQL e espera o healthcheck
npm run db:check               # prova a conexão (SELECT version())
npm run dev                    # http://localhost:3000
```

## Variáveis de ambiente

Fonte única: `.env.example` (versionado, sem segredos) → `.env.local` (ignorado pelo Git). Todos os consumidores leem o mesmo arquivo:

| Consumidor                                             | Como carrega                                                                                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Next.js (dev/build/start)                              | `.env.local` automaticamente                                                                                                 |
| Drizzle (`drizzle.config.ts`) e `scripts/db-check.mjs` | `loadEnvConfig` de `@next/env`                                                                                               |
| Docker Compose                                         | `--env-file .env.local`, já embutido nos scripts `npm run db:*` e `docker:app` (não rode `docker compose` direto sem o flag) |

`DATABASE_URL` é composta por `${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`, `${POSTGRES_PORT}` e `${POSTGRES_DB}` (expansão aceita por Next, Drizzle e Compose).

| Variável                                                             | Tipo                        | Uso                                                 |
| -------------------------------------------------------------------- | --------------------------- | --------------------------------------------------- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Runtime (Compose local)     | Criam e expõem o banco local em `127.0.0.1:<porta>` |
| `DATABASE_URL`                                                       | Runtime, servidor           | Conexão da aplicação                                |
| `DATABASE_URL_UNPOOLED`                                              | Runtime, servidor, opcional | Conexão direta preferida pelas migrations           |
| `LOG_LEVEL`                                                          | Runtime, servidor           | `trace`…`fatal`/`silent` (padrão `info`)            |

Variáveis de build: nenhuma. O build não precisa de banco nem de segredos; a imagem Docker não recebe `.env*` (`.dockerignore`) e a configuração entra só em runtime. `NEXT_PUBLIC_*` não é usado; nunca coloque segredos nele. Argumento de build do Dockerfile: `NODE_VERSION` (padrão `26`).

## Banco

- `npm run db:up` / `db:down`: sobe/derruba o contêiner `db` (PostgreSQL 18). Os dados ficam no volume nomeado `saas-template_postgres-data`, que `db:down` preserva.
- Apagar os dados locais (destrutivo): `docker compose --env-file .env.local down -v`.
- Sem schema ainda: `db:generate` informa "nothing to migrate". Com schema: `db:generate` → revisar o SQL em `drizzle/` → `db:migrate`. Não use produção como ambiente de teste.
- Porta 5432 ocupada? Altere `POSTGRES_PORT` em `.env.local`.

## Verificar

`npm run check` — formatação, lint, tipos, lint tipado, regras locais, testes e build; não conecta ao banco. Banco: `npm run db:check`. Imagem: `npm run docker:app` e `curl localhost:3000/api/health`.

## Agentes

Leia [AGENTS.md](../AGENTS.md); [CLAUDE.md](../CLAUDE.md) importa as mesmas instruções. Skills e integrações: [setup.md](setup.md).

## Problemas conhecidos

- Build precisa de rede (Google Fonts via `next/font/google`), inclusive no `docker build`.
- `npm start` copia `public` e `.next/static` para `.next/standalone` antes de iniciar (exigência do modo `standalone`).
- npm bloqueia scripts de instalação não aprovados (`allowScripts`); `esbuild` (dependência do `drizzle-kit`) é bloqueado e o `drizzle-kit` funciona normalmente.
