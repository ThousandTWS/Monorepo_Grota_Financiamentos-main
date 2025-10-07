# Grota Financiamentos — Monorepo Turborepo

Este repositório é um **starter Turborepo** adaptado para o projeto **Grota Financiamentos de Veículos**. Contém o website público, a Área do Logista (painel para lojistas) e um CRM interno para gestão de propostas, clientes e contratos — organizados num monorepo para compartilhar UI, configs e utilitários.

> Estrutura pensada para desenvolvimento rápido, deploy independente de cada app e compartilhamento de componentes e tipos.

---

## O que tem aqui

### Aplicações e pacotes

* `client` — Site público (Next.js)

  * Site institucional, 
* `logista` — Área do Logista (Next.js)

  * Painel onde cada lojista faz cadastro de veículos, acompanha propostas, agenda prazos e consulta recebíveis.
* `admin` — CRM interno (Next.js)

> Todos os apps e pacotes usam TypeScript.

---

## Estrutura de pastas sugerida

```
/ (root)
├─ apps/
│  ├─ client/
│  ├─ logista/
│  └─ admin/
├─ packages/
│  ├─ ui/
│  ├─ eslint-config/
│  └─ typescript-config/
└─ turbo.json
```

