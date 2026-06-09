"use client";

export type GalleryItem = {
  id: string;
  style: string;
  resultUrl: string;
  originalPreview: string;
  createdAt: number;
};

const KEY = "roomi.gallery";
const MAX_ITEMS = 20;

export function loadGallery(): GalleryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveToGallery(item: GalleryItem): void {
  if (typeof window === "undefined") return;
  const existing = loadGallery().filter((i) => i.id !== item.id);
  const updated = [item, ...existing].slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function removeFromGallery(id: string): void {
  if (typeof window === "undefined") return;
  const updated = loadGallery().filter((i) => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function formatDate(ts: number, locale: string): string {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ts));
}
