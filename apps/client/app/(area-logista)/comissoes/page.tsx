// Comissões e Repasse - Relatório, extrato, download
export default function ComissoesPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl space-y-8">
      <h1 className="text-3xl font-bold mb-4">Comissões e Repasse</h1>
      {/* Relatório de comissões */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Relatório de Comissões</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Contrato</th>
                <th className="p-2">Valor</th>
                <th className="p-2">Status</th>
                <th className="p-2">Recibo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">#12345</td>
                <td className="p-2">R$ 1.200</td>
                <td className="p-2 text-green-600">Pago</td>
                <td className="p-2">
                  <button className="text-primary">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Extrato financeiro */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Extrato Financeiro</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gray-50 rounded p-4">
            <span className="block text-muted-foreground">Pendentes</span>
            <span className="text-xl font-bold text-yellow-500">R$ 2.000</span>
          </div>
          <div className="flex-1 bg-gray-50 rounded p-4">
            <span className="block text-muted-foreground">Pagos</span>
            <span className="text-xl font-bold text-green-600">R$ 8.000</span>
          </div>
        </div>
      </div>
      {/* Download de recibos/notas */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-2">Recibos e Notas</h2>
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          [Lista de recibos/notas para download]
        </div>
      </div>
    </div>
  );
}
