"use client";

import React, { useState } from "react";
import { Calculator, Search } from "lucide-react";

function BoxCalculator() {
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleValue, setVehicleValue] = useState("50000");
  const [downPayment, setDownPayment] = useState("10000");
  const [months, setMonths] = useState("48");

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(vehicleValue) - parseFloat(downPayment);
    const interestRate = 0.015; // 1.5% ao mês (exemplo)
    const n = parseInt(months);

    if (principal <= 0 || n <= 0) return 0;

    const monthlyPayment =
    principal * (interestRate * Math.pow(1 + interestRate, n)) / (
    Math.pow(1 + interestRate, n) - 1);
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const handleVeiculeSearch = async () => {
    if(vehiclePlate === "") {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("Timeout excedido"), 120000);
    const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dhdGV3YXkuYXBpYnJhc2lsLmlvL2FwaS92Mi9hdXRoL3JlZ2lzdGVyIiwiaWF0IjoxNzQwMzE4NjYxLCJleHAiOjE3NzE4NTQ2NjEsIm5iZiI6MTc0MDMxODY2MSwianRpIjoiNTBpUDBMZlRScXRMcjJnNyIsInN1YiI6IjEzOTY3IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.dsHtxbpV7o9nANhtEm50YvRtaxYghsNYopwhO8Sr-L4";

    try {
      const response = await fetch("https://gateway.apibrasil.io/api/v2/vehicles/base/000/dados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`
        },
        body: JSON.stringify({ placa: vehiclePlate, homolog: false }),
        signal: controller.signal,
        redirect: "follow",
        credentials: "include",
        cache: "no-store"
      })

      clearTimeout(timeoutId)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Erro na requisição:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="xc5-k:l">
      <div
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl overflow-hidden"
        data-oid="h3sdzvr">

        <div
          className="bg-[#1B4B7C] text-white py-8 px-6 md:px-10"
          data-oid="q2b7sdn">

          <div
            className="flex items-center justify-center gap-3 mb-3"
            data-oid="fjnzuxo">

            <Calculator size={32} data-oid="fwqhdpc" />
            <h2 className="text-3xl md:text-4xl font-bold" data-oid="bzwvgvx">
              Simulador de Financiamento
            </h2>
          </div>
          <p className="text-center text-blue-200 text-lg" data-oid=":-uihgp">
            Calcule sua parcela mensal e planeje seu financiamento
          </p>
        </div>

        <div className="p-6 md:p-10" data-oid=":c32kxn">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            data-oid="::.1zek">

            {/* Inputs */}
            <div className="space-y-6 relative" data-oid="5y2o:25">
              <div className="flex flex-col">
                <div data-oid="r3:w5y4">
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    data-oid="6sj4pey">

                    Placa do Veículo
                  </label>
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all text-gray-800 font-medium text-lg"
                    placeholder="MPA7466"
                    data-oid="ievfkz-" />
                </div>

                <button
                  className="mt-3 w-full flex items-center justify-center gap-3 bg-[#1B4B7C] hover:bg-[#153a5f] text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  data-oid="fao713q"
                  onClick={handleVeiculeSearch}
                >

                  Consultar Veículo
                  <Search />
                </button>
              </div>

              <div data-oid="r3:w5y4">
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  data-oid="6sj4pey">

                  Valor do Veículo
                </label>
                <input
                  type="number"
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all text-gray-800 font-medium text-lg"
                  placeholder="R$ 0,00"
                  data-oid="ievfkz-" />

              </div>

              <div data-oid="2bjyyil">
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  data-oid=".lvy-jt">

                  Valor de Entrada
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all text-gray-800 font-medium text-lg"
                  placeholder="R$ 0,00"
                  data-oid="ubem697" />

              </div>

              <div data-oid="5dk4onf">
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  data-oid="0f460x:">

                  Prazo (meses)
                </label>
                <select
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B7C] focus:border-transparent transition-all text-gray-800 font-medium text-lg"
                  data-oid="h5q8pgq">

                  <option value="12" data-oid="q5h2nit">
                    12 meses
                  </option>
                  <option value="24" data-oid="q-v9onk">
                    24 meses
                  </option>
                  <option value="36" data-oid="veqq95a">
                    36 meses
                  </option>
                  <option value="48" data-oid="h:lloej">
                    48 meses
                  </option>
                  <option value="60" data-oid="mt0i1ug">
                    60 meses
                  </option>
                  <option value="72" data-oid=":58dy0v">
                    72 meses
                  </option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 md:p-8 flex flex-col justify-center"
              data-oid="0nyfkux">

              <div className="text-center mb-6" data-oid="2bdpdl:">
                <p
                  className="text-gray-700 text-sm font-semibold mb-2"
                  data-oid="z-uzxxu">

                  Parcela Mensal Estimada
                </p>
                <p
                  className="text-5xl md:text-6xl font-bold text-[#1B4B7C]"
                  data-oid="_1eoh:w">

                  {formatCurrency(monthlyPayment)}
                </p>
              </div>

              <div
                className="space-y-3 bg-white rounded-lg p-5 shadow-md"
                data-oid="ohbx_tf">

                <div
                  className="flex justify-between items-center py-2 border-b border-gray-200"
                  data-oid="a8u_eg6">

                  <span
                    className="text-gray-700 font-medium"
                    data-oid=":rleid.">

                    Valor Total Financiado:
                  </span>
                  <span className="text-gray-900 font-bold" data-oid=":w8rnkn">
                    {formatCurrency(
                      parseFloat(vehicleValue) - parseFloat(downPayment)
                    )}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center py-2 border-b border-gray-200"
                  data-oid="wk33cp_">

                  <span
                    className="text-gray-700 font-medium"
                    data-oid="r75vxiv">

                    Total a Pagar:
                  </span>
                  <span className="text-gray-900 font-bold" data-oid="fcjj3gc">
                    {formatCurrency(monthlyPayment * parseInt(months))}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center py-2"
                  data-oid="6f_xvry">

                  <span
                    className="text-gray-700 font-medium"
                    data-oid="kc2yabf">

                    Taxa de Juros:
                  </span>
                  <span className="text-[#1B4B7C] font-bold" data-oid="iy3-5ls">
                    1,5% a.m.
                  </span>
                </div>
              </div>

              <button
                className="mt-6 w-full bg-[#1B4B7C] hover:bg-[#153a5f] text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                data-oid="fao713q">

                Solicitar Proposta
              </button>
            </div>
          </div>

          <div
            className="mt-8 p-4 bg-blue-50 border-l-4 border-[#1B4B7C] rounded"
            data-oid="claeqnw">

            <p className="text-sm text-gray-700" data-oid="8e64fyb">
              <strong data-oid="q72isjo">Nota:</strong> Os valores apresentados
              são meramente ilustrativos. As condições finais podem variar
              conforme análise de crédito e política comercial vigente.
            </p>
          </div>
        </div>
      </div>
    </div>);

}

export default BoxCalculator;