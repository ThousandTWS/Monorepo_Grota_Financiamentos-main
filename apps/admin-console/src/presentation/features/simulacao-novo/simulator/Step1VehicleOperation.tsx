import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Input, Select, Spin, Switch, Typography } from "antd";
import { ArrowRight, Car, Users } from "lucide-react";
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
  const [brandQuery, setBrandQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [yearQuery, setYearQuery] = useState("");

  const vehicleTypeId = useMemo(
    () => getVehicleTypeId(formData.vehicleCategory),
    [formData.vehicleCategory],
  );
  const filteredBrands = useMemo(() => {
    const query = brandQuery.trim().toLowerCase();
    if (!query) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(query));
  }, [brands, brandQuery]);
  const filteredModels = useMemo(() => {
    const query = modelQuery.trim().toLowerCase();
    if (!query) return models;
    return models.filter((model) => model.name.toLowerCase().includes(query));
  }, [models, modelQuery]);
  const filteredYears = useMemo(() => {
    const query = yearQuery.trim().toLowerCase();
    if (!query) return years;
    return years.filter((year) => year.name.toLowerCase().includes(query));
  }, [years, yearQuery]);

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

  const handleBrandChange = useCallback(async (value: string) => {
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
    setModelQuery("");
    setYearQuery("");

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
  }, [vehicleTypeId, updateFormData]);

  const handleModelChange = useCallback(async (value: string) => {
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
    setYearQuery("");

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
  }, [vehicleTypeId, formData.vehicle.brandCode, updateFormData]);

  const handleYearChange = useCallback(async (value: string) => {
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
  }, [vehicleTypeId, formData.vehicle.brandCode, formData.vehicle.modelCode, updateFormData]);

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

  const getPopupContainer = useCallback((triggerNode: HTMLElement) => {
    return triggerNode.parentElement || document.body;
  }, []);

  return (
    <div className="space-y-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#134B73]" />
            <span className="text-lg font-semibold text-[#134B73]">Tipo de Operacao</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Typography.Text>Loja</Typography.Text>
            <Select
              value={selectedDealerId ? String(selectedDealerId) : undefined}
              onChange={(value) => onDealerChange(value ? Number(value) : null)}
              disabled={dealersLoading || dealers.length === 0}
              placeholder={
                dealersLoading
                  ? "Carregando lojas..."
                  : dealers.length
                    ? "Selecione a loja"
                    : "Nenhuma loja encontrada"
              }
              options={dealers.map((dealer) => {
                const labelBase =
                  dealer.enterprise || dealer.fullName || `Lojista #${dealer.id}`;
                const label = dealer.referenceCode
                  ? `${labelBase} - ${dealer.referenceCode}`
                  : labelBase;
                return { value: String(dealer.id), label };
              })}
              className="w-full"
              showSearch
              optionFilterProp="label"
              getPopupContainer={getPopupContainer}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Typography.Text>Tipo de Pessoa</Typography.Text>
              <Select
                value={formData.personType ?? undefined}
                onChange={(value) => {
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
                options={[
                  { value: "PF", label: "Pessoa Fisica (PF)" },
                  { value: "PJ", label: "Pessoa Juridica (PJ)" },
                ]}
                className="w-full"
                getPopupContainer={getPopupContainer}
              />
            </div>

            <div className="space-y-2">
              <Typography.Text>Tipo de Operacao</Typography.Text>
              <Select
                value={formData.operationType ?? undefined}
                onChange={(value) =>
                  updateField("operationType", value as SimulatorFormData["operationType"])
                }
                options={[
                  { value: "financiamento", label: "Financiamento" },
                  { value: "autofin", label: "AutoFin" },
                ]}
                className="w-full"
                getPopupContainer={getPopupContainer}
              />
            </div>

            <div className="space-y-2">
              <Typography.Text>Categoria do Veiculo</Typography.Text>
              <Select
                value={formData.vehicleCategory ?? undefined}
                onChange={(value) => {
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
                options={[
                  { value: "leves", label: "Veiculos Leves" },
                  { value: "motos", label: "Motos" },
                  { value: "pesados", label: "Veiculos Pesados" },
                ]}
                className="w-full"
                getPopupContainer={getPopupContainer}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#134B73]" />
            <span className="text-lg font-semibold text-[#134B73]">
              Vendedores vinculados
            </span>
          </div>
        }
        style={{ minHeight: selectedDealerId ? "auto" : "120px" }}
      >
        <div className="space-y-3">
          {!selectedDealerId ? (
            <p className="text-sm text-muted-foreground">
              Selecione uma loja para visualizar os vendedores vinculados.
            </p>
          ) : loadingSellers ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spin size="small" />
              <span>Carregando vendedores...</span>
            </div>
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
        </div>
      </Card>

      <Card title={<span className="text-lg font-semibold text-[#134B73]">Dados do Veiculo</span>}>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Switch
              checked={formData.vehicle.isZeroKm}
              onChange={(checked) => updateFormData("vehicle", { isZeroKm: checked })}
            />
            <Typography.Text className="text-base font-medium">Veiculo 0 KM</Typography.Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Typography.Text>Marca</Typography.Text>
              <Select
                value={
                  formData.vehicle.brandCode
                    ? `${formData.vehicle.brandCode}|${formData.vehicle.brand}`
                    : undefined
                }
                onChange={handleBrandChange}
                disabled={loadingBrands || !brands.length}
                placeholder={loadingBrands ? "Carregando..." : "Selecione a marca"}
                showSearch
                onSearch={setBrandQuery}
                filterOption={false}
                options={filteredBrands.map((brand) => ({
                  value: `${brand.code}|${brand.name}`,
                  label: brand.name,
                }))}
                className="w-full"
                getPopupContainer={getPopupContainer}
              />
              {loadingBrands && <Typography.Text type="secondary">Carregando marcas...</Typography.Text>}
            </div>

            <div className="space-y-2">
              <Typography.Text>Modelo</Typography.Text>
              <Select
                value={
                  formData.vehicle.modelCode
                    ? `${formData.vehicle.modelCode}|${formData.vehicle.model}`
                    : undefined
                }
                onChange={handleModelChange}
                disabled={!formData.vehicle.brandCode || loadingModels}
                placeholder={loadingModels ? "Carregando..." : "Selecione o modelo"}
                showSearch
                onSearch={setModelQuery}
                filterOption={false}
                options={filteredModels.map((model) => ({
                  value: `${model.code}|${model.name}`,
                  label: model.name,
                }))}
                className="w-full"
                getPopupContainer={getPopupContainer}
              />
              {loadingModels && <Typography.Text type="secondary">Carregando modelos...</Typography.Text>}
            </div>

            <div className="space-y-2">
              <Typography.Text>Ano/Modelo</Typography.Text>
              <Select
                value={
                  formData.vehicle.yearCode
                    ? `${formData.vehicle.yearCode}|${formData.vehicle.year}`
                    : undefined
                }
                onChange={handleYearChange}
                disabled={!formData.vehicle.modelCode || loadingYears}
                placeholder={loadingYears ? "Carregando..." : "Selecione o ano"}
                showSearch
                onSearch={setYearQuery}
                filterOption={false}
                options={filteredYears.map((year) => ({
                  value: `${year.code}|${year.name}`,
                  label: year.name,
                }))}
                className="w-full"
                getPopupContainer={getPopupContainer}
              />
              {loadingYears && <Typography.Text type="secondary">Carregando anos...</Typography.Text>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Typography.Text>Valor FIPE</Typography.Text>
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
              <Typography.Text>Placa (opcional)</Typography.Text>
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
        </div>
      </Card>

      <Card
        className="bg-gradient-to-br from-[#134B73] to-[#0a2940]"
        title={<span className="text-lg font-semibold text-white">Condicoes do Financiamento</span>}
      >
        <div className="space-y-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="space-y-2">
              <Typography.Text className="text-white">Valor a Financiar</Typography.Text>
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
            <div className="space-y-2 ">
              <Typography.Text className="text-white">Prazo (meses)</Typography.Text>
              <Select
                value={formData.financial.termMonths ? String(formData.financial.termMonths) : undefined}
                onChange={(value) =>
                  updateFormData("financial", { termMonths: Number(value) })
                }
                options={["12", "24", "36", "48", "60", "72"].map((term) => ({
                  value: term,
                  label: `${term} meses`,
                }))}
                className="w-full"
                getPopupContainer={getPopupContainer}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-5">
        <Button onClick={handleNext} type="primary" size="large">
          Proximo: Dados Pessoais
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
