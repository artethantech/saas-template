# SaaS Template

Base técnica para um produto SaaS: Next.js, PostgreSQL e Docker prontos; os fluxos do produto (ver [PRODUCT.md](PRODUCT.md)) são implementados um por vez.

## Executar

Requisitos: Node.js 26 LTS (`nvm use`), npm, Docker com Compose.

```bash
npm ci
cp .env.example .env.local   # defina POSTGRES_PASSWORD (valor local qualquer)
npm run db:up                # PostgreSQL local, volume persistente, healthcheck
npm run dev                  # http://localhost:3000
```

Verificar a base (não precisa de banco nem de credenciais): `npm run check`.

Imagem de produção contra o banco local: `npm run docker:app` (http://localhost:3000, `GET /api/health`).

## Documentação

- [Produto e escopo](PRODUCT.md)
- [Preparação local](docs/onboarding.md)
- [Estrutura e decisões técnicas](docs/architecture.md)
- [Design e acessibilidade](docs/design.md)
- [Verificações de qualidade](docs/quality.md)
- [Instruções para agentes](AGENTS.md)
- [Setup e evidências](docs/setup.md)

## Próxima entrega

Confirmar o produto e implementar o fluxo de cadastro e login (primeiro schema e primeira migration). Detalhes em [PRODUCT.md](PRODUCT.md#próxima-entrega).
