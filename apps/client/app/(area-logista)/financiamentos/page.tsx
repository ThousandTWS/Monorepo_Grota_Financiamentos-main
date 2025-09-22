"use client";

import React from "react";
import { useFinanciamentosBreadcrumb } from "@/src/application/core/hooks/useBreadcrumb";

function FinanciamentosPage() {
  useFinanciamentosBreadcrumb();

  return (
    <div>
      <h1>Financiamentos</h1>
    </div>
  );
}

export default FinanciamentosPage;
