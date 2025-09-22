// Notificações e Alertas - Avisos, alertas, mensagens
export default function NotificacoesPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl space-y-8">
      <h1 className="text-3xl font-bold mb-4">Notificações e Alertas</h1>
      {/* Avisos de propostas com pendências */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Propostas com Pendências</h2>
        <div className="h-16 flex items-center justify-center text-muted-foreground">
          [Lista de propostas com pendências]
        </div>
      </div>
      {/* Alertas de documentos inválidos */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Documentos Inválidos</h2>
        <div className="h-16 flex items-center justify-center text-muted-foreground">
          [Lista de documentos inválidos]
        </div>
      </div>
      {/* Mensagens importantes */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-2">Mensagens Importantes</h2>
        <div className="h-16 flex items-center justify-center text-muted-foreground">
          [Mensagens da Grota]
        </div>
      </div>
    </div>
  );
}
