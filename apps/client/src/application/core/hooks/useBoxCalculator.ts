import { useEffect, useState } from "react";
import {vehicleInfo } from "@/src/application/core/@types/vehicleInfo.type";
import { parseCurrency } from "../utils/currency/parseCurrency";

export function useBoxCalculator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState<vehicleInfo>({} as vehicleInfo);
  const [vehicleValue, setVehicleValue] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [months, setMonths] = useState("48");

  const calculateMonthlyPayment = () => {
    const principal = parseCurrency(vehicleValue) - parseCurrency(downPayment);
    const interestRate = 0.015; // 1.5% ao mês (exemplo)
    const n = parseInt(months);

    if (principal <= 0 || n <= 0) return 0;

    const monthlyPayment =
    principal * (interestRate * Math.pow(1 + interestRate, n)) / (
    Math.pow(1 + interestRate, n) - 1);
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();

  useEffect(() => {
    const handleVeiculeSearch = setTimeout(async () => {
      if(vehiclePlate.length !== 7) return;
      if(vehiclePlate.length === 7) setVehicleInfo({} as vehicleInfo);

      const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dhdGV3YXkuYXBpYnJhc2lsLmlvL2FwaS92Mi9hdXRoL3JlZ2lzdGVyIiwiaWF0IjoxNzQwMzE4NjYxLCJleHAiOjE3NzE4NTQ2NjEsIm5iZiI6MTc0MDMxODY2MSwianRpIjoiNTBpUDBMZlRScXRMcjJnNyIsInN1YiI6IjEzOTY3IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.dsHtxbpV7o9nANhtEm50YvRtaxYghsNYopwhO8Sr-L4";

      try {
        setLoading(true);
        const response = await fetch("https://gateway.apibrasil.io/api/v2/vehicles/base/000/dados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiToken}`
          },
          body: JSON.stringify({ placa: vehiclePlate, homolog: false }),
          cache: "no-store"
        })
        const data = await response.json()
        if (!data.data || !data.data.MODELO) {
          setError(true);
          setVehicleInfo({} as vehicleInfo);
          return;
        }
        setVehicleInfo(prev => ({
          ...(prev || {}),
          modelo: data.data.MODELO,
          cor: data.data.cor,
          ano_modelo: data.data.ano_modelo,
          // valor_fipe: data.data.fipe.valor_fipe,
        }));
        setError(false);
      } catch (error) {
        console.error("Erro na requisição:", error);
        setError(true);
        setVehicleInfo({} as vehicleInfo);
      } finally {
        setLoading(false);
      }
    }, 1500);

    return () => clearTimeout(handleVeiculeSearch);
  }, [vehiclePlate])

  return {
    loading,
    error,
    vehiclePlate,
    setVehiclePlate,
    vehicleInfo,
    vehicleValue,
    setVehicleValue,
    downPayment,
    setDownPayment,
    months,
    setMonths,
    monthlyPayment,
  };
}