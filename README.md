# Grota Financiamentos — Monorepo Turborepo

Este repositório é um **starter Turborepo** adaptado para o projeto **Grota Financiamentos de Veículos**. Contém o website público, a Área do Logista (painel para lojistas) e um CRM interno para gestão de propostas, clientes e contratos — organizados num monorepo para compartilhar UI, configs e utilitários.

> Estrutura pensada para desenvolvimento rápido, deploy independente de cada app e compartilhamento de componentes e tipos.

---

## O que tem aqui

### Aplicações e pacotes

- `public-site` — site institucional e páginas públicas (Next.js)
- `dealer-portal` — painel do lojista com BFF para autenticação/rotas (`/app/api/auth/*`)
- `admin-console` — CRM interno + BFF seguindo o mesmo padrão de sessão e permissões
- `api-service` — API Spring Boot que concentra propostas, notificações e cadastros
- `e2e-tests` — suíte Playwright para cenários end-to-end

> Todos os apps e pacotes usam TypeScript.

---

## Arquitetura Geral

```
┌──────────────┐      ┌───────────────────────┐      ┌───────────────┐
│ public-site  │ HTTP │ dealer-portal (BFF)   │ HTTP │ api-service   │
│              │ ───▶ │ /api/auth/*           │ ───▶ │ /api/v1/grota │
└──────────────┘      └─────────┬─────────────┘      └───────────────┘
                                 │
                                 │ WS + REST
                        ┌────────▼─────────┐
                        │ admin-console    │
                        │ realtime server  │
                        └──────────────────┘
```

- **public-site**: landing page, captação e onboarding. O login/cadastro chama o BFF do painel do lojista (`NEXT_PUBLIC_LOGISTA_PANEL_URL`) para que o cookie de sessão httpOnly seja emitido no mesmo domínio do painel.
- **dealer-portal**: BFF + UI. A camada `/app/api/auth/*` proxia as rotas da API Spring, criptografa/renova sessões (`packages/auth`) e expõe apenas cookies seguros (`grota.logista.session`). O middleware (`apps/dealer-portal/middleware.ts`) valida o escopo/role antes de renderizar qualquer rota protegida.
- **admin-console**: CRM interno com o mesmo padrão de BFF (rotas `/api/auth/*` + middleware). Após autenticar, consome os serviços de propostas/logistas, WebSocket compartilhado (`packages/realtime-*`) e dashboards.
- **api-service**: serviços REST em Spring Boot que concentram os domínios de proposta, notificações e autenticação.
- **packages/**:
  - `auth`: utilitário de criptografia AES-GCM usado pelos dois painéis para serializar a sessão.
  - `ui`, `eslint-config`, `typescript-config`: componentes e configuração compartilhados.
  - `realtime-client`/`server`: camada de WebSocket que conecta admin ↔ logista para recados e sync de propostas.
- **infrastructure/**: playbooks e IaC para subir os serviços (Dockerfiles, pipelines e scripts).
- **generators/**: templates Plop/Turbo para gerar novas features com a mesma estrutura de pastas.
- **e2e-tests/**: suíte Playwright para garantir cobertura de ponta a ponta das jornadas críticas.

### Fluxo de autenticação recomendado

1. Usuário cria conta no **public-site** → `POST ${NEXT_PUBLIC_LOGISTA_PANEL_URL}/api/auth/register`.
2. Painel **dealer-portal** proxia o request para `POST /auth/register` (Spring), aguarda verificação e grava sessão quando o login acontece.
3. Ao ser redirecionado para `/visao-geral`, o middleware do painel valida o cookie e carrega `GET /auth/me`.
4. O painel **admin-console** repete o mesmo modelo (BFF + sessão cifrada) e garante isolamento por papel (`ADMIN_SESSION_SECRET`).

> Nunca faça o login diretamente contra o endpoint da API; use sempre o BFF do painel correspondente para que o cookie esteja no domínio certo.

## Estrutura de pastas sugerida

```
/ (root)
├─ apps/
│  ├─ public-site/
│  ├─ dealer-portal/
│  ├─ admin-console/
│  ├─ api-service/
│  └─ e2e-tests/
├─ packages/
│  ├─ ui/
│  ├─ eslint-config/
│  ├─ typescript-config/
│  ├─ realtime-client/
│  └─ realtime-server/
└─ turbo.json
```

## Comunicação em tempo real (Admin ↔ Logista)

Foi adicionado um canal WebSocket compartilhado para permitir que o painel administrativo envie recados imediatos aos lojistas diretamente do dashboard:

1. **Suba o servidor** dedicado no workspace:

   ```bash
   Websocks
   pnpm realtime
   pnpm --filter @grota/realtime-server dev
   
   Apps
   pnpm dev --filter grota-website
   pnpm dev --filter grota-painel-logista
   pnpm dev --filter grota-painel-admin

   ```

   > O servidor usa `ws://localhost:4545` por padrão (configurável via `WS_PORT`).

2. **Defina o endpoint** público nos apps que consumirão o canal, por exemplo em `.env.local`:

   ```bash
   NEXT_PUBLIC_REALTIME_WS_URL=ws://localhost:4545
   ```


## Comunicação em tempo real (Admin ↔ Logista)

Foi adicionado um canal WebSocket compartilhado para permitir que o painel administrativo envie recados imediatos aos lojistas diretamente do dashboard:

1. **Suba o servidor** dedicado no workspace:

   ```bash
   Websocks
   pnpm realtime
   pnpm --filter @grota/realtime-server dev
   
   Apps
   pnpm dev --filter grota-website
   pnpm dev --filter grota-painel-logista
   pnpm dev --filter grota-painel-admin

   ```

   > O servidor usa `ws://localhost:4545` por padrão (configurável via `WS_PORT`).

2. **Defina o endpoint** público nos apps que consumirão o canal, por exemplo em `.env.local`:

   ```bash
   NEXT_PUBLIC_REALTIME_WS_URL=ws://localhost:4545
   ```

3. Abra as páginas `apps/admin-console/(admin)/visao-geral` e `apps/dealer-portal/(logista)/visao-geral` para visualizar o card *Canal Admin ↔ Logista*. As mensagens viajam instantaneamente enquanto ambos estiverem conectados.

Os pacotes `packages/realtime-client` (hook + tipos compartilhados) e `packages/realtime-server` (servidor ws com histórico e presença) concentram a implementação.

## API – Propostas e Notificações

O backend Spring agora expõe os contratos necessários para integrar o fluxo completo entre logista e admin:

- `POST /api/v1/grota-financiamentos/proposals` cria uma nova ficha. Payload mínimo:

```json
{
  "dealerId": 1,
  "sellerId": 2,
  "customerName": "Fulano de Tal",
  "customerCpf": "12345678900",
  "customerBirthDate": "1990-05-10",
  "customerEmail": "cliente@email.com",
  "customerPhone": "11999999999",
  "cnhCategory": "AB",
3. Abra as páginas `apps/admin-console/(admin)/visao-geral` e `apps/dealer-portal/(logista)/visao-geral` para visualizar o card *Canal Admin ↔ Logista*. As mensagens viajam instantaneamente enquanto ambos estiverem conectados.

Os pacotes `packages/realtime-client` (hook + tipos compartilhados) e `packages/realtime-server` (servidor ws com histórico e presença) concentram a implementação.

## API – Propostas e Notificações

O backend Spring agora expõe os contratos necessários para integrar o fluxo completo entre logista e admin:

- `POST /api/v1/grota-financiamentos/proposals` cria uma nova ficha. Payload mínimo:

```json
{
  "dealerId": 1,
  "sellerId": 2,
  "customerName": "Fulano de Tal",
  "customerCpf": "12345678900",
  "customerBirthDate": "1990-05-10",
  "customerEmail": "cliente@email.com",
  "customerPhone": "11999999999",
  "cnhCategory": "AB",
  "hasCnh": true,
  "vehiclePlate": "ABC1D23",
  "fipeCode": "001234",
  "fipeValue": 95000,
  "vehicleBrand": "Toyota",
  "vehicleModel": "Corolla Cross",
  "vehicleYear": 2023,
  "downPaymentValue": 20000,
  "financedValue": 75000,
  "notes": "Observações opcionais"
}
```

- `GET /api/v1/grota-financiamentos/proposals?dealerId=&status=` lista as propostas com filtros opcionais.
- `PATCH /api/v1/grota-financiamentos/proposals/{id}/status` atualiza o status (SUBMITTED, PENDING, APPROVED, REJECTED) e as notas.

Para notificações:

- `POST /api/v1/grota-financiamentos/notifications` recebe `{ "title", "description", "actor", "targetType", "targetId", "href" }`.
- `GET /api/v1/grota-financiamentos/notifications?targetType=ADMIN&targetId=` lista notificações por tipo/alvo.
- `PATCH /api/v1/grota-financiamentos/notifications/{id}/read` marca como lida.

Esses contratos permitem alimentar o WebSocket de notificações e sincronizar a esteira entre admin/logista.

### Páginas sincronizadas automaticamente

- **Esteira de Propostas** (apps `admin-console` e `dealer-portal`): novas fichas criadas em qualquer lado já aparecem no outro painel sem necessidade de atualizar a página. Ao salvar um rascunho é emitido um snapshot com os dados básicos via evento `PROPOSAL_CREATED` e todos os clientes atualizam sua fila imediatamente.
- **Gestão de Logistas** (apps `admin-console` → `dealer-portal` e card “Lojistas cadastrados” da visão geral): criar, editar ou excluir um lojista dispara eventos `DEALER_UPSERTED/DEALER_DELETED`, fazendo com que a tabela principal e os cards do dashboard reflitam a alteração em tempo real.
- **Canal Admin ↔ Logista** (dashboard geral): continua disponível para trocas rápidas; o mesmo socket é compartilhado com os eventos acima, então basta manter o servidor WebSocket ativo para usar toda a sincronização.
- **Upload de Documentos** (apps `dealer-portal`): o formulário de envio na rota `/documentos` publica eventos `DOCUMENT_UPLOADED/DOCUMENTS_REFRESH_REQUEST`, exibindo o status de análise sem recarregar a página e notificando o backoffice sobre novos arquivos.
- **Gestão de Documentos** (apps `admin-console`): a página `/gestao-documentos` agora consome o backend real, revisa arquivos via `PUT /documents/{id}/review` e replica as ações para o painel do lojista com eventos `DOCUMENT_REVIEW_UPDATED/DOCUMENTS_REFRESH_REQUEST`.

> Sempre que futuros endpoints do backend estiverem disponíveis, basta converter os handlers atuais para disparar os mesmos eventos (ou o `DEALER/PROPOSALS_REFRESH_REQUEST`) após persistir a operação – a UI já está preparada para escutar as notificações.


Gerar chave openssl rand -base64 48
Z1z3Uay+jLoTyGj0GFua1T6PcmjnZFjETZnHVv/OhjtC8RzuULEKttX+ZHqn01ti