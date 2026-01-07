// Formatter com timezone específico do Brasil (America/Sao_Paulo)
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

const normalizeTimestamp = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Tenta fazer match com diferentes formatos de data/hora
  const match = trimmed.match(
    /^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2}:\d{2})(\.\d+)?([zZ]|[+-]\d{2}:?\d{2})?$/,
  );
  if (!match) return trimmed;
  const [, datePart, timePart, fraction, tz] = match;
  let normalized = `${datePart}T${timePart}`;
  if (fraction) {
    const ms = fraction.slice(1, 4).padEnd(3, "0");
    normalized += `.${ms}`;
  }
  // Se não tem timezone, assume que é UTC (como o backend envia)
  normalized += tz ?? "Z";
  return normalized;
};

const parseBackendDate = (value?: string) => {
  if (!value) return null;
  const normalized = normalizeTimestamp(value);
  if (!normalized) return null;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

export const formatDateTime = (value?: string) => {
  const date = parseBackendDate(value);
  if (!date) return "--";
  // Formata usando o timezone do Brasil (America/Sao_Paulo)
  // Isso garante que a hora seja exibida corretamente no horário de Brasília
  return DATE_TIME_FORMATTER.format(date);
};

export const formatTime = (value?: string) => {
  const date = parseBackendDate(value);
  return date ? TIME_FORMATTER.format(date) : "";
};
