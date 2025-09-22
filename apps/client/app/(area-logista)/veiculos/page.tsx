// Gestão de Veículos - Cadastro, consulta, histórico
export default function VeiculosPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl space-y-8">
      <h1 className="text-3xl font-bold mb-4">Gestão de Veículos</h1>
      {/* Cadastro de veículo */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Cadastrar Novo Veículo</h2>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="border rounded p-2" placeholder="Marca" />
          <input className="border rounded p-2" placeholder="Modelo" />
          <input className="border rounded p-2" placeholder="Ano" />
          <input className="border rounded p-2" placeholder="Valor" />
          <button className="col-span-1 md:col-span-4 bg-primary text-white rounded p-2 mt-2">
            Cadastrar
          </button>
        </form>
      </div>
      {/* Consulta de veículos cadastrados */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Veículos Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Marca</th>
                <th className="p-2">Modelo</th>
                <th className="p-2">Ano</th>
                <th className="p-2">Valor</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Fiat</td>
                <td className="p-2">Uno</td>
                <td className="p-2">2020</td>
                <td className="p-2">R$ 35.000</td>
                <td className="p-2">
                  <button className="text-primary">Ver histórico</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Histórico de financiamentos */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-2">
          Histórico de Financiamentos do Veículo
        </h2>
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          [Tabela de financiamentos]
        </div>
      </div>
    </div>
  );
}
