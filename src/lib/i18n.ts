import type { Dictionary } from "@/dictionaries/ru";

export const LOCALES = ["ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export function isValidLocale(v: unknown): v is Locale {
  return LOCALES.includes(v as Locale);
}

const dictionaries = {
  ru: () => import("@/dictionaries/ru").then((m) => m.default),
  en: () => import("@/dictionaries/en").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
