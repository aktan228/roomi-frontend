"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { STYLES } from "@/lib/styles";
import { useSelectedStyle } from "@/lib/useSelectedStyle";

export default function StylePage() {
  const router = useRouter();
  const { style, setStyle } = useSelectedStyle();

  function pick(id: string) {
    const s = STYLES.find((x) => x.id === id);
    if (s) setStyle(s);
  }

  const featured = STYLES[0];
  const rest = STYLES.slice(1);

  return (
    <AppShell>
      <h1 className="text-3xl font-bold tracking-tight">Choose your style</h1>
      <p className="mt-2 text-muted">
        Pick a foundation for your AI-enhanced living space.
      </p>

      {/* Featured */}
      <button
        onClick={() => pick(featured.id)}
        className={`relative mt-6 block aspect-[16/10] w-full overflow-hidden rounded-3xl text-left ring-2 transition ${
          style.id === featured.id ? "ring-coral" : "ring-transparent"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={featured.image}
          alt={featured.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {featured.trending && (
          <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold tracking-wide">
            TRENDING
          </span>
        )}
        <span className="absolute bottom-4 left-4 text-2xl font-bold text-white">
          {featured.name}
        </span>
      </button>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {rest.map((s) => (
          <button
            key={s.id}
            onClick={() => pick(s.id)}
            className={`relative block aspect-square overflow-hidden rounded-3xl text-left ring-2 transition ${
              style.id === s.id ? "ring-coral" : "ring-transparent"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt={s.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-3 left-3 text-lg font-bold text-white">
              {s.name}
            </span>
          </button>
        ))}
      </div>

      {/* AI Stylist */}
      <div className="mt-6 rounded-3xl border border-border bg-card/50 p-5">
        <h2 className="text-lg font-bold">AI Stylist</h2>
        <p className="mt-1 text-sm text-muted">
          Analyze your current space and suggest the perfect match
          automatically.
        </p>
        <div className="mt-4">
          <Button onClick={() => router.push("/")}>Start analysis</Button>
        </div>
      </div>
    </AppShell>
  );
}
