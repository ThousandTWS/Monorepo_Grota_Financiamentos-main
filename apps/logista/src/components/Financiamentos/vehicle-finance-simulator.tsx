/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Car, TrendingUp, DollarSign, Clock, Percent, Search, CheckCircle, AlertCircle } from "lucide-react"

interface SimulationResult {
  percentage: number
  downPayment: number
  financed: number
  term: number
  installment: number
}

interface VehicleInfo {
  placa: string
  tipo: string // Added vehicle type field
  marca: string
  modelo: string
  ano: string
  cor: string
  combustivel: string
  valor?: string
}

export function VehicleFinanceSimulator() {
  const [plateNumber, setPlateNumber] = useState<string>("")
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null)
  const [vehicleValue, setVehicleValue] = useState<string>("")
  const [downPayment, setDownPayment] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [plateError, setPlateError] = useState<string>("")
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])

  const debouncedPlateLookup = useCallback(
    debounce((plate: string) => {
      if (isValidPlate(plate)) {
        fetchVehicleByPlate(plate)
      }
    }, 800),
    [],
  )

  useEffect(() => {
    if (plateNumber.length >= 7) {
      debouncedPlateLookup(plateNumber)
    } else {
      setVehicleInfo(null)
      setPlateError("")
      setVehicleValue("")
    }
  }, [plateNumber, debouncedPlateLookup])

  const isValidPlate = (plate: string): boolean => {
    // Remove spaces and convert to uppercase
    const cleanPlate = plate.replace(/\s/g, "").toUpperCase()

    // Old format: ABC1234 or new format: ABC1D23
    const oldFormat = /^[A-Z]{3}[0-9]{4}$/
    const newFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/

    return oldFormat.test(cleanPlate) || newFormat.test(cleanPlate)
  }

  const formatPlateNumber = (value: string): string => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()

    if (cleaned.length <= 3) {
      return cleaned
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`
    }
  }

  const fetchVehicleByPlate = async (plate: string) => {
    setLoading(true)
    setPlateError("")

    try {
      console.log("[v0] Fetching vehicle info for plate:", plate)

      // Mock API call - replace with actual license plate API
      // Example: https://apicarros.com/v1/consulta/{plate}
      // For demonstration, we'll simulate the API response
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      const mockVehicleData: VehicleInfo = {
        placa: plate,
        tipo: "AUTOMÓVEL", // Changed to more common vehicle type
        marca: "VOLKSWAGEN",
        modelo: "GOL 1.0 MI",
        ano: "2020",
        cor: "BRANCA",
        combustivel: "FLEX",
      }

      console.log("[v0] Setting vehicle info:", mockVehicleData)
      setVehicleInfo(mockVehicleData)

      // Fetch FIPE price based on vehicle info
      await fetchFipePrice(mockVehicleData)
    } catch (error) {
      console.error("[v0] Error fetching vehicle info:", error)
      setPlateError("Não foi possível encontrar informações para esta placa. Verifique se a placa está correta.")
      setVehicleInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchFipePrice = async (vehicle: VehicleInfo) => {
    try {
      console.log("[v0] Fetching FIPE price for vehicle:", vehicle)

      // This would typically involve:
      // 1. Finding the brand code in FIPE API
      // 2. Finding the model code
      // 3. Getting the price for the specific year

      // For demonstration, we'll use a mock price
      // In a real implementation, you'd need to map the vehicle info to FIPE codes
      const mockPrice = "R$ 25.000,00"
      const cleanValue = mockPrice.replace(/[R$.]/g, "").replace(",", ".")
      setVehicleValue(cleanValue)
    } catch (error) {
      console.error("[v0] Error fetching FIPE price:", error)
      // Set a default value or let user input manually
      setVehicleValue("")
    }
  }

  const handleSimulate = () => {
    console.log("[v0] Starting simulation with:", { vehicleValue, downPayment })

    if (!vehicleValue || !downPayment) {
      console.log("[v0] Missing required values")
      return
    }

    const vehicleVal = Number.parseFloat(
      vehicleValue
        .replace(/[^\d.,]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    )
    const downPaymentVal = Number.parseFloat(
      downPayment
        .replace(/[^\d.,]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    )

    console.log("[v0] Parsed values:", { vehicleVal, downPaymentVal })

    if (isNaN(vehicleVal) || isNaN(downPaymentVal) || vehicleVal <= 0 || downPaymentVal < 0) {
      console.log("[v0] Invalid values detected")
      return
    }

    if (downPaymentVal >= vehicleVal) {
      console.log("[v0] Down payment cannot be greater than or equal to vehicle value")
      return
    }

    const financedAmount = vehicleVal - downPaymentVal
    const downPaymentPercentage = (downPaymentVal / vehicleVal) * 100

    console.log("[v0] Calculated values:", { financedAmount, downPaymentPercentage })

    const results: SimulationResult[] = [
      {
        percentage: Math.round(downPaymentPercentage),
        downPayment: downPaymentVal,
        financed: financedAmount,
        term: 24,
        installment: calculateInstallment(financedAmount, 0.0199, 24), // 1.99% monthly rate
      },
      {
        percentage: Math.round(downPaymentPercentage),
        downPayment: downPaymentVal,
        financed: financedAmount,
        term: 36,
        installment: calculateInstallment(financedAmount, 0.0179, 36), // 1.79% monthly rate
      },
      {
        percentage: Math.round(downPaymentPercentage),
        downPayment: downPaymentVal,
        financed: financedAmount,
        term: 48,
        installment: calculateInstallment(financedAmount, 0.0159, 48), // 1.59% monthly rate
      },
    ]

    console.log("[v0] Simulation results:", results)
    setSimulationResults(results)
  }

  const calculateInstallment = (principal: number, monthlyRate: number, months: number): number => {
    if (monthlyRate === 0) return principal / months

    const factor = Math.pow(1 + monthlyRate, months)
    return (principal * monthlyRate * factor) / (factor - 1)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            {"Simulador de"} <span className="text-primary">{"Financiamento"}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            {"Digite a placa do seu veículo e encontre as melhores condições de financiamento"}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-0 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Car className="h-6 w-6 text-primary" />
                  {"Consulta por Placa"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">{"Placa do Veículo"}</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(formatPlateNumber(e.target.value))}
                        className="h-14 pl-12 pr-12 bg-background border-2 border-border hover:border-primary/50 focus:border-primary transition-colors text-lg font-mono tracking-wider"
                        placeholder="ABC-1234"
                        maxLength={8}
                      />
                      {vehicleInfo && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                      {plateError && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {plateError && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {plateError}
                      </p>
                    )}
                  </div>

                  {vehicleInfo && (
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          {"Informações do Veículo Encontrado"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">{"Placa:"}</span>
                            <span className="font-bold text-foreground">{vehicleInfo.placa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">{"Tipo:"}</span>
                            <span className="font-semibold text-foreground">{vehicleInfo.tipo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">{"Marca:"}</span>
                            <span className="font-semibold text-foreground">{vehicleInfo.marca}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">{"Modelo:"}</span>
                            <span className="font-semibold text-foreground">{vehicleInfo.modelo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">{"Ano:"}</span>
                            <span className="font-semibold text-foreground">{vehicleInfo.ano}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">{"Cor:"}</span>
                            <span className="font-semibold text-foreground">{vehicleInfo.cor}</span>
                          </div>
                          <div className="flex justify-between md:col-span-2">
                            <span className="text-muted-foreground font-medium">{"Combustível:"}</span>
                            <span className="font-semibold text-foreground">{vehicleInfo.combustivel}</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {"Dados obtidos automaticamente pela consulta da placa"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">{"Valor do Veículo"}</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={vehicleValue}
                        onChange={(e) => setVehicleValue(e.target.value)}
                        className="h-12 pl-10 bg-background border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    {vehicleInfo && vehicleValue && (
                      <p className="text-xs text-muted-foreground">{"Valor baseado na tabela FIPE"}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">{"Valor da Entrada"}</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="h-12 pl-10 bg-background border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>
                </div>

                {/* Simulate Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleSimulate}
                    disabled={!vehicleValue || !downPayment}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-4 h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Calculator className="mr-3 h-5 w-5" />
                    {"Simular Financiamento"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="glass-effect border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{"Consulta Automática"}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {"Digite apenas a placa e as informações do veículo são carregadas automaticamente."}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-chart-3/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-chart-3" />
                  </div>
                  <h3 className="font-semibold text-foreground">{"Dados FIPE"}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {"Valores atualizados conforme a tabela oficial da Fundação Instituto de Pesquisas Econômicas."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
       

        {/* Results Section */}
        {simulationResults.length > 0 && (
          <div className="mt-12">
            <Card className="glass-effect border-0 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calculator className="h-6 w-6 text-primary" />
                  {"Resultado da Simulação"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-border">
                  {/* Table Header */}
                  <div className="bg-muted/50 px-6 py-4 border-b border-border">
                    <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        {"Entrada"}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {"Valor Entrada"}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {"Financiado"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {"Prazo"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        {"Parcela"}
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-border">
                    {simulationResults.map((result, index) => (
                      <div key={index} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div className="font-semibold text-primary">{result.percentage}%</div>
                          <div className="font-medium">{formatCurrency(result.downPayment)}</div>
                          <div className="text-muted-foreground">{formatCurrency(result.financed)}</div>
                          <div className="font-medium">{result.term}x</div>
                          <div className="font-bold text-lg text-primary">{formatCurrency(result.installment)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        


        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="glass-effect border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
                <p className="text-foreground font-medium">{"Consultando informações da placa..."}</p>
                <p className="text-sm text-muted-foreground mt-2">{"Aguarde um momento"}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
