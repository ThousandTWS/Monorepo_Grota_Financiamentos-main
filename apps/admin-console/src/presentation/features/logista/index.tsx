"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { Logista } from "./components/columns";
import { getAllLogistics } from "@/application/services/Logista/logisticService";

export default function LogistasFeature() {
  const [logistas, setLogistas] = useState<Logista[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const fetchLogistas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllLogistics();
      setLogistas(data);
    } catch (error) {
      console.log("Falha ao carregar logistas:", error)
      setError("Não foi possível carregar a lista de logistas.")
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
      fetchLogistas();
  }, [])

  //const handleUpdateLogistas = (updatedLogistas: Logista[]) => {setLogistas(updatedLogistas)}

  if (isLoading) {
    return <div data-oid="53hj6yg">Carregando lista de logistas...</div>;
  }

  if (error) {
    return <div data-oid="53hj6yg" style={{ color: 'red' }}>Erro: {error}</div>;
  }

  return (
    <DataTable data={logistas} onUpdate={setLogistas} data-oid="53hj6yg" />
  );

}