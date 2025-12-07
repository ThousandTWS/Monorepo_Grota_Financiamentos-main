# Permissões e Controle de Acesso

## Resumo

O sistema **Grota Financiamentos** permite que **TODOS** os usuários autenticados possam criar fichas de propostas, independente do role (VENDEDOR, OPERADOR ou ADMIN).

## Roles Disponíveis

- **VENDEDOR**: Pode criar e visualizar fichas
- **OPERADOR**: Pode criar e visualizar fichas  
- **ADMIN**: Pode criar, visualizar e gerenciar fichas (aprovar/rejeitar)

## Criação de Fichas

### Painel do Logista (dealer-portal)

✅ **Todos os roles podem criar fichas**

- Rota: `/simulacao/novo`
- Botão: "Nova Ficha" na página `/esteira-propostas`
- Sem restrições de role no middleware
- Qualquer usuário autenticado tem acesso

### Painel Admin (admin-console)

✅ **Admin pode criar fichas**

- Rota: `/esteira-de-propostas/nova` (redireciona para orientação)
- Botão: "Nova Ficha" na página `/esteira-de-propostas`
- Recomenda-se usar o painel do logista para criação completa

## Implementação Técnica

### Middlewares

Ambos os painéis (`dealer-portal` e `admin-console`) possuem middlewares que:

1. Verificam apenas se o usuário está **autenticado**
2. **NÃO** verificam o role/permissão específica
3. Permitem acesso a todas as rotas protegidas após autenticação

### Arquivos Relevantes

- `apps/dealer-portal/middleware.ts` - Middleware do painel logista
- `apps/admin-console/middleware.ts` - Middleware do painel admin
- `apps/dealer-portal/app/(logista)/simulacao/novo/page.tsx` - Formulário de criação
- `apps/dealer-portal/src/presentation/features/esteira-propostas/components/QueueFilters.tsx` - Botão "Nova Ficha"

## Como Funciona

1. Usuário faz login (VENDEDOR, OPERADOR ou ADMIN)
2. Middleware valida apenas a autenticação (não o role)
3. Usuário acessa qualquer rota protegida
4. Botão "Nova Ficha" está visível para todos
5. Formulário de criação está acessível em `/simulacao/novo`

## Futuras Melhorias

Se no futuro for necessário restringir permissões por role:

1. Adicionar verificação de `session.role` no middleware
2. Criar lista de rotas permitidas por role
3. Implementar HOC ou hook para verificar permissões na UI
4. Esconder/desabilitar botões baseado no role do usuário

## Exemplo de Código

```typescript
// Middleware atual (SEM restrição de role)
export async function middleware(request: NextRequest) {
  const session = await decryptSession(sessionValue, SESSION_SECRET);
  const isAuthenticated = !!session && !!session.userId;
  
  if (!isAuthenticated) {
    return redirect("/login");
  }
  
  // Todos os usuários autenticados podem prosseguir
  return NextResponse.next();
}
```

## Perguntas Frequentes

**Q: Vendedor pode criar fichas?**  
A: ✅ Sim, qualquer usuário autenticado pode criar fichas.

**Q: Operador pode criar fichas?**  
A: ✅ Sim, qualquer usuário autenticado pode criar fichas.

**Q: Admin pode criar fichas?**  
A: ✅ Sim, qualquer usuário autenticado pode criar fichas.

**Q: Preciso configurar algo para habilitar isso?**  
A: ❌ Não, já está habilitado por padrão. Basta estar autenticado.

**Q: Como restringir por role no futuro?**  
A: Adicione verificação de `session.role` no middleware e crie lógica condicional nas rotas.
