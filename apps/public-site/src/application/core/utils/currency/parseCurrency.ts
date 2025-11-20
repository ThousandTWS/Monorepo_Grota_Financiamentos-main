export const parseCurrency = (formatted: string) => {
    return Number(formatted.replace(/[^\d]/g, "")) / 100;
  };