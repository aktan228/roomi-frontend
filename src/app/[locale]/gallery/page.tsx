"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useDictionary } from "@/components/DictionaryProvider";
import { Button } from "@/components/Button";
import { loadGallery, removeFromGallery, formatDate, type GalleryItem } from "@/lib/gallery";
import { STYLES } from "@/lib/styles";

export default function GalleryPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const { dict } = useDictionary();
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setItems(loadGallery());
  }, []);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    removeFromGallery(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleOpen(item: GalleryItem) {
    router.push(`/${locale}/design/${item.id}?style=${item.style}`);
  }

  const styleLabel = (id: string) =>
    STYLES.find((s) => s.id === id)?.name ?? id;

  return (
    <AppShell>
      <h1 className="text-3xl font-bold tracking-tight">{dict.gallery.title}</h1>
      <p className="mt-2 text-muted">{dict.gallery.subtitle}</p>

      {items.length === 0 ? (
        /* Empty state */
        <div className="mt-10 flex flex-col items-center rounded-3xl border-2 border-dashed border-border bg-card/40 px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 mb-4">
            <Sparkles className="text-coral" size={28} />
          </div>
          <p className="font-semibold text-lg">{dict.gallery.empty}</p>
          <p className="mt-1 text-sm text-muted">{dict.gallery.emptyHint}</p>
          <div className="mt-6 w-full max-w-xs">
            <Button onClick={() => router.push(`/${locale}`)}>
              <Sparkles size={16} />
              {dict.upload.cta}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 pb-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpen(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleOpen(item)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card/40 text-left transition hover:border-coral hover:shadow-md"
            >
              {/* Result image */}
              <div className="relative aspect-square w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.resultUrl}
                  alt={styleLabel(item.style)}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />

                {/* Original thumbnail — small overlay */}
                {item.originalPreview && (
                  <div className="absolute bottom-2 left-2 h-10 w-10 overflow-hidden rounded-xl border-2 border-white shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.originalPreview}
                      alt="before"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  aria-label="Delete"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Info */}
              <div className="px-3 py-2.5">
                <span className="inline-block rounded-full bg-coral/10 px-2 py-0.5 text-[11px] font-semibold text-coral">
                  {styleLabel(item.style)}
                </span>
                <p className="mt-1 text-[11px] text-muted">
                  {formatDate(item.createdAt, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
