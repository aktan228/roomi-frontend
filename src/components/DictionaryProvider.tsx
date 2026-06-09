"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/dictionaries/ru";
import type { Locale } from "@/lib/i18n";

type DictCtx = { dict: Dictionary; locale: Locale };

const Ctx = createContext<DictCtx | null>(null);

export function DictionaryProvider({
  dict,
  locale,
  children,
}: DictCtx & { children: React.ReactNode }) {
  return <Ctx.Provider value={{ dict, locale }}>{children}</Ctx.Provider>;
}

export function useDictionary(): DictCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDictionary must be used inside DictionaryProvider");
  return ctx;
}
