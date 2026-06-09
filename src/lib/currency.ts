const CURRENCY_KEY = "roomi.currency";

export type CurrencyCode = "KGS" | "KZT" | "UZS" | "RUB" | "TJS" | "USD";

export const CURRENCIES: { code: CurrencyCode; label: string; flag: string }[] = [
  { code: "KGS", label: "Кыргызский сом",   flag: "🇰🇬" },
  { code: "KZT", label: "Казахский тенге",  flag: "🇰🇿" },
  { code: "UZS", label: "Узбекский сум",    flag: "🇺🇿" },
  { code: "RUB", label: "Российский рубль", flag: "🇷🇺" },
  { code: "TJS", label: "Таджикский сомони",flag: "🇹🇯" },
  { code: "USD", label: "Доллар США",       flag: "🇺🇸" },
];

// Approximate rates: 1 KGS → target currency
const RATES: Record<CurrencyCode, number> = {
  KGS: 1,
  KZT: 5.2,
  UZS: 140,
  RUB: 1.0,
  TJS: 0.12,
  USD: 0.011,
};

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "KGS";
  return (localStorage.getItem(CURRENCY_KEY) as CurrencyCode) ?? "KGS";
}

export function setStoredCurrency(code: CurrencyCode) {
  localStorage.setItem(CURRENCY_KEY, code);
}

export function convertFromKGS(amountKGS: number, to: CurrencyCode): number {
  return Math.round(amountKGS * RATES[to]);
}

export function formatAmount(amountKGS: number, currency: CurrencyCode): string {
  const converted = convertFromKGS(amountKGS, currency);
  return converted.toLocaleString("ru") + " " + currency;
}
