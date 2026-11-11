# Qualidade

## Comandos

| Script                 | O que prova                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run format:check` | Formatação Prettier (`npm run format` corrige)                                                               |
| `npm run lint`         | ESLint: presets Next/TypeScript, limite de 350 linhas, logger, fronteira de dados e camadas, guardas Drizzle |
| `npm run lint:typed`   | `no-floating-promises` e `no-misused-promises` como erro (lint com informação de tipos)                      |
| `npm run lint:rules`   | Autoteste das regras `quality/*` (`scripts/verify-quality-rules.mjs`)                                        |
| `npm run typecheck`    | `next typegen` + `tsc --noEmit`                                                                              |
| `npm test`             | Vitest (Node): env, logger, pool do banco (mock) e rota de saúde                                             |
| `npm run build`        | Build de produção; não precisa de banco nem segredos                                                         |
| `npm run check`        | Todos acima, em sequência. Rode antes de concluir qualquer mudança                                           |
| `npm run db:check`     | Conexão real ao PostgreSQL configurado (exige `db:up`)                                                       |

CI (`.github/workflows/ci.yml`) executa `npm ci` e os mesmos checks, um a um, sem credenciais nem banco. Ainda não rodou no GitHub (sem remoto).

## Regras de base

- TypeScript estrito e presets oficiais.
- Limite de 350 linhas por arquivo; organização proporcional ao comportamento.
- Logging estruturado no servidor (sem `console`); sem acesso direto ao banco na apresentação.
- Camadas: `src/domains` e `src/contracts` não importam `next/*`, `@/app` nem `@/components`; só repositories importam `@/infrastructure/db`.
- Drizzle: `update`/`delete` sem `where` são erro; revisar queries e migrations.
- Validação de entrada e ambiente com Zod; erros sem segredos.

## Estratégia de testes

Testar comportamento, decisões, falhas e regressões; sem testes que repetem a implementação. Hoje: unidade em Node (validação de ambiente sem vazar valores, redação de segredos do logger, ciclo de vida do pool com `pg` mockado, liveness). Não há testes de DOM nem E2E: entram com o primeiro fluxo que precisar. Os testes com `pg` mockado não provam conexão real; `db:check` prova.

Lint tipado: comando `npm run lint:typed`; custo medido nesta máquina: ~4,8 s e ~690 MB de pico (projeto pequeno). Reavaliar conforme o código crescer.

## Revisão após implementação

Escopo por risco e pelo diff real; revisão independente para trabalho não trivial, quando disponível. Registrar alvo exato, código conectado, achados confirmados e cobertura. Encerrar quando achados relevantes estiverem resolvidos ou justificados, checks afetados passarem e riscos residuais registrados.

## Revisão de segurança

Fonte versionada: bloco "Prompt" de `docs/prompts/13-security-review.md` do vibe-coding-toolkit, revisão `7ef68dd7b00ddfc5cd464458855e4ab66dd2128f` (2026-11-08), <https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/7ef68dd7b00ddfc5cd464458855e4ab66dd2128f/docs/prompts/13-security-review.md>. Invocação: peça ao agente para ler esse arquivo e executar o bloco "Prompt" em modo repositório (ou modo diff com `base`/`head` reais), com relatório redigido salvo **fora** do repositório. É somente leitura; ausência de achados não é garantia de segurança. Para diffs sensíveis, a skill `differential-review` é opcional. Atualização: reler a fonte upstream e atualizar a revisão aqui.

## Método de melhoria do harness

Adaptação nativa do método Harness2 (não executa o framework Harness2): mudar instruções/memória só diante de uma falha observada, comparar uma única candidata contra a linha de base com checagens independentes. Fonte: `docs/prompts/15-harness-improvement.md` e `docs/07-harness-evaluation.md` na mesma revisão do toolkit. Casos e resultados: `docs/setup.md`.

## Dependências e entrega

`npm audit --omit=dev` (produção) e `npm audit` (completo) devem ser lidos separadamente; ver resultado atual em `docs/setup.md`. Lint e build verdes não significam auditoria limpa. Os checks são comandos explícitos: sem hooks de Git nem bloqueios de push por padrão. Atualize este documento junto com scripts e regras.
