export function parseBRL(value: string): number {
  if (!value) return 0;

  // Remove espaços e "R$"
  let cleaned = value.replace(/\s|R\$/g, "");

  // Remove pontos (separador de milhar)
  cleaned = cleaned.replace(/\./g, "");

  // Troca vírgula por ponto (decimal)
  cleaned = cleaned.replace(",", ".");

  const numberValue = parseFloat(cleaned);

  return isNaN(numberValue) ? 0 : numberValue;
}

export function formatNumberToBRL(value: number): string {
  if (value == null || isNaN(value)) return "";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatName(nome: string): string {
  if (!nome) return "";

  const minusculas = ["de", "da", "do", "das", "dos", "e"];

  return nome
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palavra) =>
      minusculas.includes(palavra)
        ? palavra
        : palavra.charAt(0).toUpperCase() + palavra.slice(1)
    )
    .join(" ");
}

export function formatDateISO(data: string): string {
  if (!data) return "";

  const [dia, mes, ano] = data.split("/");

  return `${ano}-${mes}-${dia}`;
}