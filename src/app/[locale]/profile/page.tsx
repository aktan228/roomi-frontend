"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, Globe, Wallet, MessageSquare, Info,
  ChevronRight, Crown, DollarSign,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useDictionary } from "@/components/DictionaryProvider";
import { useToast } from "@/components/Toast";
import { loadGallery } from "@/lib/gallery";
import { CURRENCIES, getStoredCurrency, setStoredCurrency, type CurrencyCode } from "@/lib/currency";

type Budget = "economy" | "medium" | "premium";

const BUDGET_KEY = "roomi.budget";

export default function ProfilePage() {
  const { dict, locale } = useDictionary();
  const router = useRouter();
  const { show, toast } = useToast();
  const [designCount, setDesignCount] = useState(0);
  const [budget, setBudget] = useState<Budget>("medium");
  const [currency, setCurrency] = useState<CurrencyCode>("KGS");

  useEffect(() => {
    setDesignCount(loadGallery().length);
    const saved = localStorage.getItem(BUDGET_KEY) as Budget | null;
    if (saved) setBudget(saved);
    setCurrency(getStoredCurrency());
  }, []);

  function selectBudget(b: Budget) {
    setBudget(b);
    localStorage.setItem(BUDGET_KEY, b);
  }

  function selectCurrency(c: CurrencyCode) {
    setCurrency(c);
    setStoredCurrency(c);
  }

  const budgetOptions: { key: Budget; label: string }[] = [
    { key: "economy", label: dict.profile.budgetEconomy },
    { key: "medium",  label: dict.profile.budgetMedium },
    { key: "premium", label: dict.profile.budgetPremium },
  ];

  return (
    <AppShell>
      {/* Avatar + name */}
      <div className="flex items-center gap-4 pt-2">
        <div className="relative">
          <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-coral ring-offset-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.pravatar.cc/128?img=12"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold">Aktan</p>
          <p className="text-sm text-muted">aktan@roomi.ai</p>
        </div>
        <button
          onClick={() => show(dict.common.comingSoon)}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-coral hover:text-coral"
        >
          {dict.profile.editProfile}
        </button>
      </div>

      {/* Stats row */}
      <div className="mt-5 flex gap-3">
        <div className="flex flex-1 flex-col items-center rounded-2xl bg-card/60 border border-border py-3">
          <span className="text-2xl font-bold">{designCount}</span>
          <span className="mt-0.5 text-xs text-muted">{dict.profile.designs}</span>
        </div>
        <div className="flex flex-1 flex-col items-center rounded-2xl bg-coral/10 border border-coral/20 py-3">
          <span className="text-2xl font-bold text-coral">∞</span>
          <span className="mt-0.5 text-xs text-coral font-medium">{dict.profile.free}</span>
        </div>
      </div>

      {/* Premium upsell */}
      <div className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Crown size={18} className="text-yellow-400" />
          <span className="font-bold text-sm">{dict.profile.premium}</span>
        </div>
        <p className="text-xs text-white/70 mb-4">{dict.profile.upgradeDesc}</p>
        <button
          onClick={() => show(dict.common.comingSoon)}
          className="w-full rounded-2xl bg-white py-2.5 text-sm font-bold text-[#1a1a2e] transition active:scale-[0.99]"
        >
          {dict.profile.upgradeCta}
        </button>
      </div>

      {/* Settings */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {dict.profile.settings}
        </p>

        <div className="rounded-3xl border border-border bg-card/40 overflow-hidden divide-y divide-border">

          {/* Budget */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <Wallet size={18} className="text-coral" />
              <span className="text-sm font-semibold">{dict.profile.budget}</span>
            </div>
            <div className="flex gap-2">
              {budgetOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => selectBudget(key)}
                  className={`flex-1 rounded-2xl py-2 text-xs font-semibold transition ${
                    budget === key
                      ? "bg-coral text-white shadow-sm shadow-coral/30"
                      : "bg-background border border-border text-muted hover:border-coral/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center gap-3 px-4 py-4">
            <Globe size={18} className="text-coral flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{dict.profile.language}</p>
              <p className="text-xs text-muted mt-0.5">{dict.profile.languageNote}</p>
            </div>
            <div className="flex gap-1.5">
              {(["ru", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => router.push(`/${l}/profile`)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                    locale === l
                      ? "bg-coral text-white"
                      : "border border-border text-muted hover:border-coral/50"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign size={18} className="text-coral" />
              <span className="text-sm font-semibold">{dict.profile.currency}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CURRENCIES.map(({ code, flag }) => (
                <button
                  key={code}
                  onClick={() => selectCurrency(code)}
                  className={`rounded-2xl py-2 text-xs font-semibold transition ${
                    currency === code
                      ? "bg-coral text-white shadow-sm shadow-coral/30"
                      : "bg-background border border-border text-muted hover:border-coral/50"
                  }`}
                >
                  {flag} {code}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* About */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {dict.profile.about}
        </p>

        <div className="rounded-3xl border border-border bg-card/40 overflow-hidden divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-4">
            <Info size={18} className="text-muted" />
            <span className="flex-1 text-sm">{dict.profile.version}</span>
            <span className="text-xs text-muted">0.1.0 MVP</span>
          </div>
          <button
            onClick={() => show(dict.common.comingSoon)}
            className="flex w-full items-center gap-3 px-4 py-4 transition hover:bg-card/80"
          >
            <MessageSquare size={18} className="text-muted" />
            <span className="flex-1 text-left text-sm">{dict.profile.feedback}</span>
            <ChevronRight size={16} className="text-muted" />
          </button>
          <button
            onClick={() => show(dict.common.comingSoon)}
            className="flex w-full items-center gap-3 px-4 py-4 transition hover:bg-card/80"
          >
            <Sparkles size={18} className="text-coral" />
            <span className="flex-1 text-left text-sm font-semibold text-coral">roomi.ai</span>
            <span className="text-xs text-muted">AI Interior Design</span>
          </button>
        </div>
      </div>

      {toast}
    </AppShell>
  );
}
