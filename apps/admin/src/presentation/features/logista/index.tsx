"use client";

import { useState } from "react";
import { DataTable } from "./components/data-table";
import { mockLogistas } from "./mock/mock-data";
import { Logista } from "./components/columns";

export default function LogistasFeature() {
  const [logistas, setLogistas] = useState<Logista[]>(mockLogistas);

  return (
    <DataTable data={logistas} onUpdate={setLogistas} data-oid="53hj6yg" />);

}