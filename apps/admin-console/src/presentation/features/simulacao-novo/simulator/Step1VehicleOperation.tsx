import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/presentation/layout/components/ui/card";
import { Label } from "@/presentation/layout/components/ui/label";
import { Input } from "@/presentation/layout/components/ui/input";
import { Button } from "@/presentation/layout/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import { Switch } from "@/presentation/layout/components/ui/switch";
import { ArrowRight, Car, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  type Ano,
  type Marca,
  type Modelo,
  getAnos,
  getMarcas,
  getModelos,
  getValorVeiculo,
} from "@/application/services/fipe";
import { getAllSellers, type Seller } from "@/application/services/Seller/sellerService";
import type { Dealer } from "@/application/services/Logista/logisticService";
import { formatNumberToBRL, parseBRL } from "@/lib/formatters";
import {
  SimulatorFormData,
  UpdateSimulatorField,
  UpdateSimulatorFormData,
} from "../hooks/useSimulator";

type Step1VehicleOperationProps = {
  formData: SimulatorFormData;
  updateFormData: UpdateSimulatorFormData;
  updateField: UpdateSimulatorField;
  nextStep: () => void;
  dealers: Dealer[];
  dealersLoading: boolean;
  selectedDealerId: number | null;
  onDealerChange: (dealerId: number | null) => void;
  selectedSellerId: number | null;
  onSellerChange: (sellerId: number | null, sellerName?: string) => void;
};

const getVehicleTypeId = (category: SimulatorFormData["vehicleCategory"]) => {
  if (category === "motos") return 2;
  if (category === "pesados") return 3;
  return 1;
};

export default function Step1VehicleOperation({
  formData,
  updateFormData,
  updateField,
  nextStep,
  dealers,
  dealersLoading,
  selectedDealerId,
  onDealerChange,
  selectedSellerId,
  onSellerChange,
}: Step1VehicleOperationProps) {
  const [financedInput, setFinancedInput] = useState("");
  const [downPaymentInput, setDownPaymentInput] = useState("");
  const financedFocusedRef = useRef(false);
  const downPaymentFocusedRef = useRef(false);
  const [brands, setBrands] = useState<Marca[]>([]);
  const [models, setModels] = useState<Modelo[]>([]);
  const [years, setYears] = useState<Ano[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingValue, setLoadingValue] = useState(false);

  const vehicleTypeId = useMemo(
    () => getVehicleTypeId(formData.vehicleCategory),
    [formData.vehicleCategory],
  );

  useEffect(() => {
    setModels([]);
    setYears([]);
    if (!formData.vehicleCategory) {
      setBrands([]);
      return;
    }

    const loadBrands = async () => {
      try {
        setLoadingBrands(true);
        const data = await getMarcas(vehicleTypeId);
        setBrands(data);
      } catch (error) {
        toast.error("Erro ao carregar marcas FIPE");
        console.error(error);
      } finally {
        setLoadingBrands(false);
      }
    };

    loadBrands();
  }, [formData.vehicleCategory, vehicleTypeId]);

  useEffect(() => {
    let mounted = true;

    if (!selectedDealerId) {
      setSellers([]);
      setLoadingSellers(false);
      onSellerChange(null);
      return () => {
        mounted = false;
      };
    }

    const loadSellers = async () => {
      try {
        setLoadingSellers(true);
        const data = await getAllSellers(selectedDealerId);
        if (mounted) {
          setSellers(data);
        }
      } catch (error) {
        console.error("[admin][simulador] loadSellers", error);
        toast.error("Erro ao carregar vendedores vinculados.");
        if (mounted) {
          setSellers([]);
        }
      } finally {
        if (mounted) {
          setLoadingSellers(false);
        }
      }
    };

    void loadSellers();

    return () => {
      mounted = false;
    };
  }, [selectedDealerId, onSellerChange]);

  useEffect(() => {
    if (!selectedSellerId) return;
    const stillAvailable = sellers.some((seller) => seller.id === selectedSellerId);
    if (!stillAvailable) {
      onSellerChange(null);
    }
  }, [selectedSellerId, sellers, onSellerChange]);

  useEffect(() => {
    if (financedFocusedRef.current) return;
    setFinancedInput(
      formData.financial.financedAmount > 0
        ? formatNumberToBRL(formData.financial.financedAmount)
        : "",
    );
  }, [formData.financial.financedAmount]);

  useEffect(() => {
    if (downPaymentFocusedRef.current) return;
    setDownPaymentInput(
      formData.financial.downPayment > 0
        ? formatNumberToBRL(formData.financial.downPayment)
        : "",
    );
  }, [formData.financial.downPayment]);

  const handleBrandChange = async (value: string) => {
    const [brandCode, brandName] = value.split("|");

    updateFormData("vehicle", {
      brandCode,
      brand: brandName,
      modelCode: "",
      model: "",
      yearCode: "",
      year: "",
      fipeValue: 0,
      fipeCode: "",
    });

    setModels([]);
    setYears([]);

    try {
      setLoadingModels(true);
      const data = await getModelos(vehicleTypeId, brandCode);
      setModels(data);
    } catch (error) {
      toast.error("Erro ao carregar modelos");
      console.error(error);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleModelChange = async (value: string) => {
    const [modelCode, modelName] = value.split("|");

    updateFormData("vehicle", {
      modelCode,
      model: modelName,
      yearCode: "",
      year: "",
      fipeValue: 0,
      fipeCode: "",
    });

    setYears([]);

    try {
      setLoadingYears(true);
      const data = await getAnos(
        vehicleTypeId,
        formData.vehicle.brandCode,
        modelCode,
      );
      setYears(data);
    } catch (error) {
      toast.error("Erro ao carregar anos");
      console.error(error);
    } finally {
      setLoadingYears(false);
    }
  };

  const handleYearChange = async (value: string) => {
    const [yearCode, yearName] = value.split("|");

    updateFormData("vehicle", {
      yearCode,
      year: yearName,
    });

    try {
      setLoadingValue(true);
      const data = await getValorVeiculo(
        vehicleTypeId,
        formData.vehicle.brandCode,
        formData.vehicle.modelCode,
        yearCode,
      );

      const numericValue = parseBRL(data.price);

      updateFormData("vehicle", {
        fipeValue: numericValue,
        fipeCode: data.codeFipe,
      });

      toast.success("Valor FIPE carregado com sucesso!");
    } catch (error) {
      toast.error("Erro ao carregar valor FIPE");
      console.error(error);
    } finally {
      setLoadingValue(false);
    }
  };

  const handleFinancedAmountChange = (value: string) => {
    const numeric = parseBRL(value);
    setFinancedInput(value);
    updateFormData("financial", { financedAmount: numeric });
  };

  const handleDownPaymentChange = (value: string) => {
    const numeric = parseBRL(value);
    setDownPaymentInput(value);
    updateFormData("financial", { downPayment: numeric });
  };

  const validateStep = () => {
    const { vehicle, financial } = formData;

    if (!selectedDealerId) {
      toast.error("Selecione a loja para vincular a simulacao");
      return false;
    }

    if (loadingSellers) {
      toast.error("Aguarde o carregamento dos vendedores.");
      return false;
    }

    if (!selectedSellerId) {
      toast.error(
        sellers.length > 0
          ? "Selecione o vendedor responsavel pela ficha."
          : "Nenhum vendedor vinculado a esta loja.",
      );
      return false;
    }

    if (!vehicle.brand || !vehicle.model || !vehicle.year) {
      toast.error("Por favor, selecione marca, modelo e ano do veiculo");
      return false;
    }

    if (financial.financedAmount <= 0) {
      toast.error("Por favor, informe o valor a financiar");
      return false;
    }

    if (financial.termMonths <= 0) {
      toast.error("Por favor, informe o prazo em meses");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#134B73]" />
            <h2 className="text-lg font-semibold text-[#134B73]">Tipo de Operacao</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dealerId">Loja</Label>
            <Select
              value={selectedDealerId ? String(selectedDealerId) : ""}
              onValueChange={(value) =>
                onDealerChange(value ? Number(value) : null)
              }
              disabled={dealersLoading || dealers.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    dealersLoading
                      ? "Carregando lojas..."
                      : dealers.length
                        ? "Selecione a loja"
                        : "Nenhuma loja encontrada"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {dealers.map((dealer) => {
                  const labelBase =
                    dealer.enterprise || dealer.fullName || `Lojista #${dealer.id}`;
                  const label = dealer.referenceCode
                    ? `${labelBase} - ${dealer.referenceCode}`
                    : labelBase;

                  return (
                    <SelectItem key={dealer.id} value={String(dealer.id)}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personType">Tipo de Pessoa</Label>
              <Select
                value={formData.personType}
                onValueChange={(value) => {
                  updateField("personType", value as SimulatorFormData["personType"]);
                  updateFormData("personal", {
                    cpfCnpj: "",
                    name: "",
                    motherName: "",
                    birthday: "",
                    maritalStatus: "",
                    hasCnh: false,
                    cnhCategory: "",
                    companyName: "",
                    shareholderName: "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Fisica (PF)</SelectItem>
                  <SelectItem value="PJ">Pessoa Juridica (PJ)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationType">Tipo de Operacao</Label>
              <Select
                value={formData.operationType}
                onValueChange={(value) =>
                  updateField("operationType", value as SimulatorFormData["operationType"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financiamento">Financiamento</SelectItem>
                  <SelectItem value="autofin">AutoFin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleCategory">Categoria do Veiculo</Label>
              <Select
                value={formData.vehicleCategory}
                onValueChange={(value) => {
                  const nextCategory = value as SimulatorFormData["vehicleCategory"];
                  updateField("vehicleCategory", nextCategory);
                  updateFormData("vehicle", {
                    category: nextCategory,
                    brand: "",
                    brandCode: "",
                    model: "",
                    modelCode: "",
                    year: "",
                    yearCode: "",
                    fipeValue: 0,
                    fipeCode: "",
                  });
                  updateFormData("financial", {
                    financedAmount: 0,
                    downPayment: 0,
                  });
                  setBrands([]);
                  setModels([]);
                  setYears([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leves">Veiculos Leves</SelectItem>
                  <SelectItem value="motos">Motos</SelectItem>
                  <SelectItem value="pesados">Veiculos Pesados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDealerId && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#134B73]" />
              <h2 className="text-lg font-semibold text-[#134B73]">
                Vendedores vinculados
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingSellers ? (
              <p className="text-sm text-muted-foreground">
                Carregando vendedores...
              </p>
            ) : sellers.length ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Selecione o vendedor responsavel pela ficha.
                </p>
                <div className="space-y-2">
                  {sellers.map((seller) => {
                    const isSelected = selectedSellerId === seller.id;
                    const sellerLabel =
                      seller.fullName ||
                      seller.email ||
                      `Vendedor #${seller.id}`;

                    return (
                      <button
                        key={seller.id}
                        type="button"
                        onClick={() => onSellerChange(seller.id, sellerLabel)}
                        aria-pressed={isSelected}
                        className={`w-full rounded-lg border p-3 text-left transition ${
                          isSelected
                            ? "border-[#134B73] bg-[#134B73]/10"
                            : "border-slate-200/70 bg-white hover:border-[#134B73]/40"
                        }`}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {sellerLabel}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {seller.email || "--"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span>{seller.phone || "--"}</span>
                            {isSelected ? (
                              <span className="rounded-full bg-[#134B73]/10 px-2 py-1 text-[11px] font-semibold text-[#134B73]">
                                Selecionado
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum vendedor vinculado a esta loja.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#134B73]">Dados do Veiculo</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Switch
              checked={formData.vehicle.isZeroKm}
              onCheckedChange={(checked) => updateFormData("vehicle", { isZeroKm: checked })}
            />
            <Label className="text-base font-medium">Veiculo 0 KM</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Marca</Label>
              <Select
                value={
                  formData.vehicle.brandCode
                    ? `${formData.vehicle.brandCode}|${formData.vehicle.brand}`
                    : ""
                }
                onValueChange={handleBrandChange}
                disabled={loadingBrands || !brands.length}
              >
              <SelectTrigger className="w-full bg-white text-slate-900">
                <SelectValue placeholder={loadingBrands ? "Carregando..." : "Selecione a marca"} />
              </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.code} value={`${brand.code}|${brand.name}`}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select
                value={
                  formData.vehicle.modelCode
                    ? `${formData.vehicle.modelCode}|${formData.vehicle.model}`
                    : ""
                }
                onValueChange={handleModelChange}
                disabled={!formData.vehicle.brandCode || loadingModels}
              >
              <SelectTrigger className="w-full bg-white text-slate-900">
                <SelectValue placeholder={loadingModels ? "Carregando..." : "Selecione o modelo"} />
              </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.code} value={`${model.code}|${model.name}`}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ano/Modelo</Label>
              <Select
                value={
                  formData.vehicle.yearCode
                    ? `${formData.vehicle.yearCode}|${formData.vehicle.year}`
                    : ""
                }
                onValueChange={handleYearChange}
                disabled={!formData.vehicle.modelCode || loadingYears}
              >
              <SelectTrigger className="w-full bg-white text-slate-900">
                <SelectValue placeholder={loadingYears ? "Carregando..." : "Selecione o ano"} />
              </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.code} value={`${year.code}|${year.name}`}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor FIPE</Label>
              <Input
                value={
                  formData.vehicle.fipeValue > 0
                    ? formatNumberToBRL(formData.vehicle.fipeValue)
                    : ""
                }
                readOnly
                placeholder={loadingValue ? "Carregando..." : "Aguardando selecao"}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Placa (opcional)</Label>
              <Input
                value={formData.vehicle.plate}
                onChange={(e) =>
                  updateFormData("vehicle", { plate: e.target.value.toUpperCase() })
                }
                placeholder="ABC-1234"
                maxLength={8}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#134B73] to-[#0a2940]">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Condicoes do Financiamento</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Valor a Financiar</Label>
              <Input
                value={financedInput}
                onChange={(e) => handleFinancedAmountChange(e.target.value)}
                onFocus={() => {
                  financedFocusedRef.current = true;
                }}
                onBlur={() => {
                  financedFocusedRef.current = false;
                  setFinancedInput(
                    formData.financial.financedAmount > 0
                      ? formatNumberToBRL(formData.financial.financedAmount)
                      : "",
                  );
                }}
                placeholder="R$ 0,00"
                className="text-lg font-semibold bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Prazo (meses)</Label>
              <Select
                value={formData.financial.termMonths.toString()}
                onValueChange={(value) =>
                  updateFormData("financial", { termMonths: Number(value) })
                }
              >
              <SelectTrigger className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
                <SelectContent>
                  {["12", "24", "36", "48", "60", "72"].map((term) => (
                    <SelectItem key={term} value={term}>
                      {term} meses
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          size="lg"
          className="bg-[#134B73] hover:bg-[#0f3a5a]"
        >
          Proximo: Dados Pessoais
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
