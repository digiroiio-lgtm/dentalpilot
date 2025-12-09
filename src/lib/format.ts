export const currencyFormatter = (value: number, currency = "EUR") => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
};
