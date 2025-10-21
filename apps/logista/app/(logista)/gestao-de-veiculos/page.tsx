"use client";

import { useState } from "react";
import veiculosServices, {
  CreateVehiclePayload,
  VehicleResponse,
} from "../../../src/application/services/VeiculosServices/VeiculosServices";

export default function Page() {
  const [form, setForm] = useState<CreateVehiclePayload>({
    name: "",
    color: "",
    plate: "",
    modelYear: "",
    km: 0,
    condition: "NOVO",
    transmission: "MANUAL",
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<VehicleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["km", "price"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await veiculosServices.create(form);
      setSuccess(created);
      // Opcional: limpar o formulário após sucesso
      setForm({
        name: "",
        color: "",
        plate: "",
        modelYear: "",
        km: 0,
        condition: "NOVO",
        transmission: "MANUAL",
        price: 0,
      });
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      setError(apiMsg || "Falha ao cadastrar o veículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Cadastro de Veículos</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
        <label>
          Nome
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex.: Gol 1.0"
            required
          />
        </label>

        <label>
          Cor
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="Ex.: Preto"
            required
          />
        </label>

        <label>
          Placa
          <input
            name="plate"
            value={form.plate}
            onChange={handleChange}
            placeholder="Ex.: ABC-1234"
            required
          />
        </label>

        <label>
          Ano/Modelo
          <input
            type="date"
            name="modelYear"
            value={form.modelYear}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          KM
          <input
            type="number"
            name="km"
            value={form.km}
            onChange={handleChange}
            min={0}
            required
          />
        </label>

        <label>
          Condição
          <select name="condition" value={form.condition} onChange={handleChange}>
            <option value="NOVO">NOVO</option>
            <option value="USADO">USADO</option>
          </select>
        </label>

        <label>
          Transmissão
          <select
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
          >
            <option value="MANUAL">MANUAL</option>
            <option value="AUTOMATICO">AUTOMATICO</option>
          </select>
        </label>

        <label>
          Preço
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            step={0.01}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar veículo"}
        </button>
      </form>

      {success && (
        <div style={{ marginTop: 12, color: "green" }}>
          Veículo cadastrado com sucesso. ID: {success.id}
        </div>
      )}
      {error && (
        <div style={{ marginTop: 12, color: "red" }}>{error}</div>
      )}
    </div>
  );
}

