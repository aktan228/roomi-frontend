"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, CalendarDays, Loader2, ExternalLink, MessageSquare, Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { useDictionary } from "@/components/DictionaryProvider";
import { getProducts, getPlan, type RedesignResult, type ProductsResult, type PlanResult } from "@/lib/api";
import { getMockProducts, getMockPlan } from "@/lib/mock-data";
import { saveToGallery } from "@/lib/gallery";

type Tab = "products" | "plan";

export default function DesignResultPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const style = searchParams.get("style") ?? "minimal";
  const { dict } = useDictionary();

  const [design, setDesign] = useState<(RedesignResult & { original_preview?: string }) | null>(null);
  const [products, setProducts] = useState<ProductsResult | null>(null);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [tab, setTab] = useState<Tab>("products");
  const [loadingData, setLoadingData] = useState(true);

  async function handleDownload() {
    if (!design) return;
    try {
      const res = await fetch(design.result_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `roomi-${design.style}-design.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore cross-origin */ }
  }

  useEffect(() => {
    const raw = sessionStorage.getItem(`design_${id}`);
    if (raw) {
      try {
        const parsed: RedesignResult & { original_preview?: string } = JSON.parse(raw);
        setDesign(parsed);
        // Auto-save to gallery
        saveToGallery({
          id: parsed.design_id,
          style: parsed.style,
          resultUrl: parsed.result_url,
          originalPreview: parsed.original_preview ?? "",
          createdAt: Date.now(),
        });
      } catch { /* ignore */ }
    }

    Promise.all([
      getProducts(style).catch(() => getMockProducts(style)),
      getPlan(id).catch(() => getMockPlan(id)),
    ]).then(([p, pl]) => {
      setProducts(p);
      setPlan(pl);
    }).finally(() => setLoadingData(false));
  }, [id, style]);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold tracking-tight">{dict.result.title}</h1>
      <p className="mt-1 text-sm text-muted capitalize">{style} {dict.common.style}</p>

      {/* Before / After */}
      <div className="mt-4">
        {design ? (
          <BeforeAfterSlider
            before={design.original_preview ?? design.original_url}
            after={design.result_url}
            labelBefore={dict.common.before}
            labelAfter={dict.common.after}
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-card">
            <Loader2 className="animate-spin text-muted" size={32} />
          </div>
        )}
        {design?.is_mock && (
          <p className="mt-2 text-center text-xs text-muted">{dict.result.mockNotice}</p>
        )}
      </div>

      {/* Ask AI + Download */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => router.push(`/${locale}/chat?designId=${id}&style=${style}`)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-coral/30 bg-coral/5 py-3 text-sm font-semibold text-coral transition hover:bg-coral/10"
        >
          <MessageSquare size={16} /> {dict.result.askAi}
        </button>
        <button
          onClick={handleDownload}
          disabled={!design}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/40 px-4 py-3 text-sm font-semibold text-muted transition hover:border-coral/30 hover:text-coral disabled:opacity-40"
        >
          <Download size={16} />
        </button>
      </div>

      {/* Tab switcher */}
      <div className="mt-6 flex rounded-2xl bg-card p-1">
        <button
          onClick={() => setTab("products")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === "products" ? "bg-white shadow text-foreground" : "text-muted"
          }`}
        >
          <ShoppingBag size={16} /> {dict.result.shoppingList}
        </button>
        <button
          onClick={() => setTab("plan")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === "plan" ? "bg-white shadow text-foreground" : "text-muted"
          }`}
        >
          <CalendarDays size={16} /> {dict.result.renoPlan}
        </button>
      </div>

      {loadingData ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="animate-spin text-muted" size={28} />
        </div>
      ) : tab === "products" ? (
        <ProductsTab products={products} dict={dict.result} />
      ) : (
        <PlanTab plan={plan} dict={dict.result} />
      )}
    </AppShell>
  );
}

function ProductsTab({ products, dict }: { products: ProductsResult | null; dict: Record<string, string> }) {
  if (!products) return null;
  const fmt = (n: number) => n.toLocaleString("ru-KG") + " " + products.currency;

  return (
    <div className="mt-4 space-y-3 pb-4">
      <div className="flex items-center justify-between rounded-2xl bg-coral/10 px-4 py-3">
        <span className="text-sm font-medium text-coral">{dict.totalBudget}</span>
        <span className="font-bold text-coral">{fmt(products.total_price)}</span>
      </div>
      {products.products.map((p) => (
        <div key={p.id} className="flex gap-3 rounded-2xl border border-border bg-card/40 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <p className="text-sm font-semibold leading-snug">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted">{p.shop}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">{fmt(p.price)}</span>
              <a href={p.url} className="inline-flex items-center gap-1 rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
                {dict.buy} <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlanTab({ plan, dict }: { plan: PlanResult | null; dict: Record<string, string> }) {
  if (!plan) return null;
  const fmt = (n: number) => n.toLocaleString("ru-KG") + " " + plan.currency;

  return (
    <div className="mt-4 space-y-4 pb-4">
      <div className="flex items-center justify-between rounded-2xl bg-coral/10 px-4 py-3">
        <span className="text-sm font-medium text-coral">{plan.total_weeks} {dict.weeksTotal}</span>
        <span className="font-bold text-coral">{fmt(plan.total_cost)}</span>
      </div>
      {plan.weeks.map((week) => (
        <div key={week.week} className="rounded-2xl border border-border bg-card/40 p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{week.icon}</span>
            <div>
              <p className="text-xs text-muted">{dict.week} {week.week}</p>
              <p className="font-semibold">{week.title}</p>
            </div>
            <span className="ml-auto text-sm font-bold text-coral">{fmt(week.estimated_cost)}</span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {week.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-coral" />
                {task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
