"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { useDesignJob } from "@/lib/design-job";

const STAGE_LABELS: Record<string, string> = {
  queued:     "В очереди...",
  analyzing:  "Анализируем комнату",
  briefing:   "Составляем дизайн",
  generating: "Генерируем изображение",
  done:       "Готово!",
  error:      "Ошибка",
};

export function DesignProgress() {
  const { jobId, status, progress, result, error, clear } = useDesignJob();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "ru";

  useEffect(() => {
    if (status === "done" && result) {
      const designId = (result as Record<string, unknown>).design_id as string;
      const style    = (result as Record<string, unknown>).style as string;
      // Store result for the design page
      sessionStorage.setItem(`design_${designId}`, JSON.stringify(result));
      router.push(`/${locale}/design/${designId}?style=${style}`);
    }
  }, [status, result, router, locale]);

  if (!jobId || status === null || status === "done") return null;

  const label = STAGE_LABELS[status] ?? status;
  const isError = status === "error";

  return (
    <div className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-3 px-4 py-3">
        {isError ? (
          <span className="h-4 w-4 flex-shrink-0 rounded-full bg-red-400" />
        ) : (
          <Loader2 size={16} className="flex-shrink-0 animate-spin text-coral" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">
            {isError ? "Что-то пошло не так" : label}
          </p>
          {isError ? (
            <p className="text-xs text-muted truncate">{error}</p>
          ) : (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-coral transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        <button onClick={clear} className="flex-shrink-0 text-muted hover:text-foreground">
          <X size={14} />
        </button>
      </div>
      {!isError && (
        <p className="border-t border-border px-4 py-2 text-center text-[11px] text-muted">
          Можно переходить по другим вкладкам — дизайн продолжит создаваться
        </p>
      )}
    </div>
  );
}
