# SaaS Template

## Problema e objetivo

Ponto de partida reutilizável para produtos SaaS: uma base técnica pronta (aplicação web, banco PostgreSQL, contêiner de produção e CI) sobre a qual os fluxos do produto são implementados um por vez.

O problema de negócio e o domínio específico **ainda não foram definidos** (pendente; ver abaixo). Este documento é a fonte canônica de escopo e deve ser atualizado quando o produto for definido.

## Público e papéis

Pendente. Hipótese reversível: usuários finais autenticados que pertencem a uma organização (conta/workspace), com ao menos um papel administrativo e um papel comum.

## Fluxos da versão inicial

Nenhum fluxo está implementado. Os fluxos abaixo são **hipóteses a confirmar**, em ordem sugerida; cada um vira uma tarefa independente.

1. Cadastro e login de usuário.
2. Criação e seleção de organização (workspace) e convite de membros.
3. Fluxo central do domínio (a definir: entrada, ação e resultado esperado).
4. Assinatura/cobrança (só se o modelo de negócio exigir).

## MVP

Entregue pela base técnica (concluída): página inicial responsiva e acessível, rota de saúde `GET /api/health`, PostgreSQL local, imagem Docker de produção e CI.

Funcionalidades do produto: pendentes, a partir dos fluxos acima depois de confirmados.

## Fora de escopo

- Qualquer funcionalidade de produto na etapa de base técnica.
- Publicação, hospedagem, domínio, serviços pagos e integrações externas.
- Tabelas de exemplo: o schema só nasce com o primeiro fluxo que precisar de dados.

## Requisitos

- Interface em português do Brasil, mobile first, com navegação por teclado, foco visível e contraste adequado.
- Segredos nunca no cliente (`NEXT_PUBLIC_*`) nem na imagem Docker.
- Autorização sempre validada no servidor quando existir login.

## Restrições e decisões técnicas

- Next.js (App Router) + TypeScript estrito, Tailwind, shadcn/ui e Lucide.
- npm com `package-lock.json`; Node.js LTS 26.
- Persistência: Drizzle ORM + PostgreSQL (`pg`).
- Organização: `src/domains`, `src/infrastructure`, `src/contracts`. Detalhes e motivos em `docs/architecture.md`; evidências em `docs/setup.md`.

## Hipóteses e decisões pendentes

| Item                                   | Tipo                | Impacto                        | Próximo passo                                       |
| -------------------------------------- | ------------------- | ------------------------------ | --------------------------------------------------- |
| Problema, público e domínio do produto | Pendente (externa)  | Define fluxos, schema e UI     | Descrever o produto em uma frase e listar os fluxos |
| Autenticação (biblioteca/provedor)     | Pendente            | Primeiro fluxo provável        | Escolher ao implementar o fluxo 1                   |
| Multi-organização (tenancy)            | Hipótese            | Modelo de dados e autorização  | Confirmar antes do schema                           |
| Idioma único pt-BR                     | Hipótese reversível | Textos da UI                   | Confirmar; i18n só se necessário                    |
| Hospedagem                             | Pendente            | Pooling, variáveis de ambiente | Decidir antes do primeiro deploy                    |

## Critérios de aceite

Produto: definidos por fluxo quando o fluxo for confirmado.

Base técnica (verificada, ver `docs/setup.md`): `npm run check` passa sem credenciais; a aplicação inicia; o PostgreSQL local responde; a imagem Docker constrói e responde `GET /api/health` como usuário não privilegiado.

## Próxima entrega

Confirmar o produto e implementar o fluxo 1 (cadastro e login): escolher a solução de autenticação, criar o primeiro schema Drizzle em `src/infrastructure/db/schema/`, gerar e revisar a primeira migration, e cobrir a autorização com testes.

## Manutenção

Atualizar quando objetivo, escopo, restrições ou critérios mudarem. Decisões técnicas e evidências ficam em `docs/architecture.md` e `docs/setup.md`.
