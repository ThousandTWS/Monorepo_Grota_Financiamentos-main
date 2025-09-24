"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Car, TrendingUp, DollarSign, Clock, Percent } from "lucide-react"
import type { SimulationResult } from "@/application/@types/SimulationResult"
import type { VehiclePrice } from "@/application/@types/VehiclePrice"
import type { VehicleYear } from "@/application/@types/VehicleYear"
import type { Vehicle } from "@/application/@types/Vehicle"
import type { VehicleModel } from "@/application/@types/VehicleModel"

const vehicleTypes = [
  { id: "carros", name: "Carros", icon: Car },
  { id: "motos", name: "Motos", icon: Car },
  { id: "caminhoes", name: "Caminhões", icon: Car },
]

export function VehicleFinanceSimulator() {
  const [selectedType, setSelectedType] = useState<string>("motos")
  const [brands, setBrands] = useState<Vehicle[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [models, setModels] = useState<VehicleModel[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [years, setYears] = useState<VehicleYear[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [, setVehiclePrice] = useState<VehiclePrice | null>(null)
  const [vehicleValue, setVehicleValue] = useState<string>("")
  const [downPayment, setDownPayment] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])

  // Fetch brands when vehicle type changes
  useEffect(() => {
    if (selectedType) {
      fetchBrands(selectedType)
      setSelectedBrand("")
      setModels([])
      setSelectedModel("")
      setYears([])
      setSelectedYear("")
      setVehiclePrice(null)
    }
  }, [selectedType])

  // Fetch models when brand changes
  useEffect(() => {
    if (selectedBrand && selectedType) {
      fetchModels(selectedType, selectedBrand)
      setSelectedModel("")
      setYears([])
      setSelectedYear("")
      setVehiclePrice(null)
    }
  }, [selectedBrand, selectedType])

  // Fetch years when model changes
  useEffect(() => {
    if (selectedModel && selectedBrand && selectedType) {
      fetchYears(selectedType, selectedBrand, selectedModel)
      setSelectedYear("")
      setVehiclePrice(null)
    }
  }, [selectedModel, selectedBrand, selectedType])

  // Fetch price when year changes
  useEffect(() => {
    if (selectedYear && selectedModel && selectedBrand && selectedType) {
      fetchPrice(selectedType, selectedBrand, selectedModel, selectedYear)
    }
  }, [selectedYear, selectedModel, selectedBrand, selectedType])

  const fetchBrands = async (type: string) => {
    setLoading(true)
    try {
      console.log("[v0] Fetching brands for type:", type)
      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/${type}/marcas`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Brands response:", data)

      if (data.error) {
        console.error("[v0] API returned error:", data.error)
        setBrands([])
        return
      }

      if (Array.isArray(data)) {
        setBrands(data)
      } else {
        console.error("[v0] Brands data is not an array:", data)
        setBrands([])
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar marcas:", error)
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  const fetchModels = async (type: string, brand: string) => {
    setLoading(true)
    try {
      console.log("[v0] Fetching models for type:", type, "brand:", brand)
      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/${type}/marcas/${brand}/modelos`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Models response:", data)

      if (data.error) {
        console.error("[v0] API returned error:", data.error)
        setModels([])
        return
      }

      if (data && Array.isArray(data.modelos)) {
        setModels(data.modelos)
      } else if (Array.isArray(data)) {
        setModels(data)
      } else {
        console.error("[v0] Models data is not in expected format:", data)
        setModels([])
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar modelos:", error)
      setModels([])
    } finally {
      setLoading(false)
    }
  }

  const fetchYears = async (type: string, brand: string, model: string) => {
    setLoading(true)
    try {
      console.log("[v0] Fetching years for type:", type, "brand:", brand, "model:", model)
      const response = await fetch(
        `https://parallelum.com.br/fipe/api/v1/${type}/marcas/${brand}/modelos/${model}/anos`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Years response:", data)

      if (data.error) {
        console.error("[v0] API returned error:", data.error)
        setYears([])
        return
      }

      if (Array.isArray(data)) {
        setYears(data)
      } else {
        console.error("[v0] Years data is not an array:", data)
        setYears([])
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar anos:", error)
      setYears([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPrice = async (type: string, brand: string, model: string, year: string) => {
    setLoading(true)
    try {
      console.log("[v0] Fetching price for:", { type, brand, model, year })
      const response = await fetch(
        `https://parallelum.com.br/fipe/api/v1/${type}/marcas/${brand}/modelos/${model}/anos/${year}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Price response:", data)

      if (data.error) {
        console.error("[v0] API returned error:", data.error)
        setVehiclePrice(null)
        return
      }

      if (data && data.valor) {
        setVehiclePrice(data)
        // Auto-fill vehicle value from FIPE
        const cleanValue = data.valor.replace(/[R$.]/g, "").replace(",", ".")
        setVehicleValue(cleanValue)
      } else {
        console.error("[v0] Price data is not in expected format:", data)
        setVehiclePrice(null)
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar preço:", error)
      setVehiclePrice(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulate = () => {
    if (!vehicleValue || !downPayment) return

    const vehicleVal = Number.parseFloat(vehicleValue.replace(/[^\d.,]/g, "").replace(",", "."))
    const downPaymentVal = Number.parseFloat(downPayment.replace(/[^\d.,]/g, "").replace(",", "."))

    if (isNaN(vehicleVal) || isNaN(downPaymentVal)) return

    const financedAmount = vehicleVal - downPaymentVal
    const downPaymentPercentage = (downPaymentVal / vehicleVal) * 100

    // Generate different financing options
    const results: SimulationResult[] = [
      {
        percentage: Math.round(downPaymentPercentage),
        downPayment: downPaymentVal,
        financed: financedAmount,
        term: 24,
        installment: (financedAmount * 1.02) / 24, // 2% monthly rate
      },
      {
        percentage: Math.round(downPaymentPercentage),
        downPayment: downPaymentVal,
        financed: financedAmount,
        term: 36,
        installment: (financedAmount * 1.015) / 36, // 1.5% monthly rate
      },
      {
        percentage: Math.round(downPaymentPercentage),
        downPayment: downPaymentVal,
        financed: financedAmount,
        term: 48,
        installment: (financedAmount * 1.012) / 48, // 1.2% monthly rate
      },
    ]

    setSimulationResults(results)
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
            {"Encontre as melhores condições de financiamento para seu veículo com dados atualizados da tabela FIPE"}
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
                  {"Dados do Veículo"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Vehicle Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">{"Tipo de Veículo"}</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary/50 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">{"Marca"}</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand} disabled={brands.length === 0}>
                      <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(brands) &&
                          brands.map((brand) => (
                            <SelectItem key={brand.codigo} value={brand.codigo}>
                              {brand.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">{"Modelo"}</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel} disabled={models.length === 0}>
                      <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(models) &&
                          models.map((model) => (
                            <SelectItem key={model.codigo} value={model.codigo}>
                              {model.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">{"Ano do Modelo"}</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear} disabled={years.length === 0}>
                      <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(years) &&
                          years.map((year) => (
                            <SelectItem key={year.codigo} value={year.codigo}>
                              {year.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{"Dados FIPE"}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {"Valores atualizados conforme a tabela oficial da Fundação Instituto de Pesquisas Econômicas."}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-chart-3/10 rounded-lg">
                    <Clock className="h-5 w-5 text-chart-3" />
                  </div>
                  <h3 className="font-semibold text-foreground">{"Resultado Instantâneo"}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {"Calcule suas parcelas em segundos e compare diferentes cenários de financiamento."}
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
                <p className="text-foreground font-medium">{"Carregando dados da FIPE..."}</p>
                <p className="text-sm text-muted-foreground mt-2">{"Aguarde um momento"}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
