import { Card } from "@/src/presentation/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/presentation/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface EvolutionChartProps {
  data: Array<{ name: string; propostas: number; aprovadas: number }>;
  periodo: string;
  onPeriodoChange: (value: string) => void;
}

export function EvolutionChart({ data, periodo, onPeriodoChange }: EvolutionChartProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Evolução Temporal</h3>
        <Select value={periodo} onValueChange={onPeriodoChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meses">Meses</SelectItem>
            <SelectItem value="dias">Dias</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="propostas"
              stroke="#b61739"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="aprovadas"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}