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
│  ├─ typescript-config/
│  ├─ realtime-client/
│  └─ realtime-server/
└─ turbo.json
```

## Comunicação em tempo real (Admin ↔ Logista)

Foi adicionado um canal WebSocket compartilhado para permitir que o painel administrativo envie recados imediatos aos lojistas diretamente do dashboard:

1. **Suba o servidor** dedicado no workspace:

   ```bash
   pnpm realtime
   pnpm --filter @grota/realtime-server dev
   ```

   > O servidor usa `ws://localhost:4545` por padrão (configurável via `WS_PORT`).

2. **Defina o endpoint** público nos apps que consumirão o canal, por exemplo em `.env.local`:

   ```bash
   NEXT_PUBLIC_REALTIME_WS_URL=ws://localhost:4545
   ```

3. Abra as páginas `apps/admin/(admin)/visao-geral` e `apps/logista/(logista)/visao-geral` para visualizar o card *Canal Admin ↔ Logista*. As mensagens viajam instantaneamente enquanto ambos estiverem conectados.

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

- **Esteira de Propostas** (apps `admin` e `logista`): novas fichas criadas em qualquer lado já aparecem no outro painel sem necessidade de atualizar a página. Ao salvar um rascunho é emitido um snapshot com os dados básicos via evento `PROPOSAL_CREATED` e todos os clientes atualizam sua fila imediatamente.
- **Gestão de Logistas** (apps `admin` → `logistas` e card “Lojistas cadastrados” da visão geral): criar, editar ou excluir um lojista dispara eventos `DEALER_UPSERTED/DEALER_DELETED`, fazendo com que a tabela principal e os cards do dashboard reflitam a alteração em tempo real.
- **Canal Admin ↔ Logista** (dashboard geral): continua disponível para trocas rápidas; o mesmo socket é compartilhado com os eventos acima, então basta manter o servidor WebSocket ativo para usar toda a sincronização.

> Sempre que futuros endpoints do backend estiverem disponíveis, basta converter os handlers atuais para disparar os mesmos eventos (ou o `DEALER/PROPOSALS_REFRESH_REQUEST`) após persistir a operação – a UI já está preparada para escutar as notificações.
