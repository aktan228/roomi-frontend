"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Minus, X, Check } from "lucide-react";
import { useDesignJob } from "@/lib/design-job";

export function DesignProgress() {
  const {
    jobId, status, progress, label, result, error, minimized, originalPreview,
    minimize, expand, dismiss,
  } = useDesignJob();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "ru";

  // When generation finishes → stash result and navigate to the design page
  useEffect(() => {
    if (status === "done" && result) {
      const designId = result.design_id as string;
      const style = result.style as string;
      // Attach the uploaded photo as the "before" image
      const merged = { ...result, original_preview: originalPreview ?? result.original_preview };
      sessionStorage.setItem(`design_${designId}`, JSON.stringify(merged));
      const t = setTimeout(() => {
        router.push(`/${locale}/design/${designId}?style=${style}`);
        dismiss();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [status, result, locale, router, dismiss, originalPreview]);

  if (!jobId || status === null) return null;

  const isError = status === "error";
  const isDone = status === "done";

  // Ring geometry for the minimized FAB
  const R = 20;
  const C = 2 * Math.PI * R;
  const dash = C * (1 - progress / 100);

  return (
    <>
      {/* ── Minimized FAB (bottom-right) ──────────────────────────── */}
      <button
        onClick={expand}
        aria-label="Показать прогресс"
        className={`fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-xl transition-all duration-300 ${
          minimized && !isError ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0"
        }`}
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={R} fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
          <circle
            cx="24" cy="24" r={R} fill="none" stroke="currentColor" strokeWidth="3"
            strokeLinecap="round" className="text-coral transition-all duration-700"
            strokeDasharray={C} strokeDashoffset={dash}
          />
        </svg>
        <span className="text-[11px] font-bold text-coral">
          {isDone ? <Check size={16} /> : `${progress}%`}
        </span>
      </button>

      {/* ── Expanded card (bottom-center) ─────────────────────────── */}
      <div
        className={`fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-border bg-card shadow-xl transition-all duration-300 ${
          minimized && !isError ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {isError ? (
            <span className="h-4 w-4 flex-shrink-0 rounded-full bg-red-400" />
          ) : isDone ? (
            <Check size={16} className="flex-shrink-0 text-green-500" />
          ) : (
            <Loader2 size={16} className="flex-shrink-0 animate-spin text-coral" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">
              {isError ? "Что-то пошло не так" : label}
            </p>
            {isError ? (
              <p className="truncate text-xs text-muted">{error}</p>
            ) : (
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-coral transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Error → dismiss; otherwise → minimize (job keeps running) */}
          {isError ? (
            <button onClick={dismiss} aria-label="Закрыть" className="flex-shrink-0 text-muted hover:text-foreground">
              <X size={16} />
            </button>
          ) : (
            <button onClick={minimize} aria-label="Свернуть" className="flex-shrink-0 text-muted hover:text-foreground">
              <Minus size={16} />
            </button>
          )}
        </div>

        {!isError && !isDone && (
          <p className="border-t border-border px-4 py-2 text-center text-[11px] text-muted">
            Можно свернуть и пользоваться приложением — дизайн продолжит создаваться
          </p>
        )}

        {isError && (
          <button
            onClick={() => { dismiss(); router.push(`/${locale}`); }}
            className="w-full border-t border-border px-4 py-2 text-center text-[11px] font-semibold text-coral transition hover:bg-coral/5"
          >
            {locale === "ru" ? "Попробовать снова" : "Try again"}
          </button>
        )}
      </div>
    </>
  );
}
