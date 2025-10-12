export const formatCurrencyInput = (value: string) => {
    const onlyDigits = value.replace(/\D/g, "");

    const numericValue = Number(onlyDigits) / 100;

    return numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };