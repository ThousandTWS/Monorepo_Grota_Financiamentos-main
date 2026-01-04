const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const normalizeTimestamp = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?([zZ]|[+-]\d{2}:\d{2})?$/,
  );
  if (!match) return trimmed;
  const [, base, fraction, tz] = match;
  let normalized = base;
  if (fraction) {
    const ms = fraction.slice(1, 4).padEnd(3, "0");
    normalized += `.${ms}`;
  }
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
  return date ? DATE_TIME_FORMATTER.format(date) : "--";
};

export const formatTime = (value?: string) => {
  const date = parseBackendDate(value);
  return date ? TIME_FORMATTER.format(date) : "";
};
