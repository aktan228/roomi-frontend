"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ShoppingBag, CalendarDays, Loader2, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { getProducts, getPlan, RedesignResult, ProductsResult, PlanResult } from "@/lib/api";
import { getMockProducts, getMockPlan } from "@/lib/mock-data";

type Tab = "products" | "plan";

export default function DesignResultPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const style = searchParams.get("style") ?? "minimal";

  const [design, setDesign] = useState<RedesignResult & { original_preview?: string } | null>(null);
  const [products, setProducts] = useState<ProductsResult | null>(null);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [tab, setTab] = useState<Tab>("products");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Load design result from sessionStorage
    const raw = sessionStorage.getItem(`design_${id}`);
    if (raw) {
      try { setDesign(JSON.parse(raw)); } catch { /* ignore */ }
    }

    // Fetch products + plan — fall back to built-in mocks if backend is unreachable
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
      <h1 className="text-2xl font-bold tracking-tight">Your Redesign</h1>
      <p className="mt-1 text-sm text-muted capitalize">{style} style</p>

      {/* Before / After */}
      <div className="mt-4">
        {design ? (
          <BeforeAfterSlider
            before={design.original_preview ?? design.original_url}
            after={design.result_url}
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-card">
            <Loader2 className="animate-spin text-muted" size={32} />
          </div>
        )}
        {design?.is_mock && (
          <p className="mt-2 text-center text-xs text-muted">
            Mock preview — add Replicate key for real AI generation
          </p>
        )}
      </div>

      {/* Tab switcher */}
      <div className="mt-6 flex rounded-2xl bg-card p-1">
        <button
          onClick={() => setTab("products")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === "products" ? "bg-white shadow text-foreground" : "text-muted"
          }`}
        >
          <ShoppingBag size={16} />
          Shopping List
        </button>
        <button
          onClick={() => setTab("plan")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === "plan" ? "bg-white shadow text-foreground" : "text-muted"
          }`}
        >
          <CalendarDays size={16} />
          Reno Plan
        </button>
      </div>

      {/* Tab content */}
      {loadingData ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="animate-spin text-muted" size={28} />
        </div>
      ) : tab === "products" ? (
        <ProductsTab products={products} />
      ) : (
        <PlanTab plan={plan} />
      )}
    </AppShell>
  );
}

function ProductsTab({ products }: { products: ProductsResult | null }) {
  if (!products) return null;

  const formatted = (n: number) =>
    n.toLocaleString("ru-KG") + " " + products.currency;

  return (
    <div className="mt-4 space-y-3 pb-4">
      <div className="flex items-center justify-between rounded-2xl bg-coral/10 px-4 py-3">
        <span className="text-sm font-medium text-coral">Total budget</span>
        <span className="font-bold text-coral">{formatted(products.total_price)}</span>
      </div>

      {products.products.map((p) => (
        <div key={p.id} className="flex gap-3 rounded-2xl border border-border bg-card/40 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.name}
            className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
          />
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <p className="text-sm font-semibold leading-snug">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted">{p.shop}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{formatted(p.price)}</span>
              <a
                href={p.url}
                className="inline-flex items-center gap-1 rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white"
              >
                Buy <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlanTab({ plan }: { plan: PlanResult | null }) {
  if (!plan) return null;

  const formatted = (n: number) => n.toLocaleString("ru-KG") + " " + plan.currency;

  return (
    <div className="mt-4 space-y-4 pb-4">
      <div className="flex items-center justify-between rounded-2xl bg-coral/10 px-4 py-3">
        <span className="text-sm font-medium text-coral">{plan.total_weeks} weeks total</span>
        <span className="font-bold text-coral">{formatted(plan.total_cost)}</span>
      </div>

      {plan.weeks.map((week) => (
        <div key={week.week} className="rounded-2xl border border-border bg-card/40 p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{week.icon}</span>
            <div>
              <p className="text-xs text-muted">Week {week.week}</p>
              <p className="font-semibold">{week.title}</p>
            </div>
            <span className="ml-auto text-sm font-bold text-coral">
              {formatted(week.estimated_cost)}
            </span>
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
