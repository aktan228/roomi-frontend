"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, Loader2, ChevronDown, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { useSelectedStyle } from "@/lib/useSelectedStyle";
import { STYLES } from "@/lib/styles";
import { startRedesign } from "@/lib/api";
import { storeJob } from "@/lib/design-job";
import { useDictionary } from "@/components/DictionaryProvider";

// Room types
const ROOM_TYPES = {
  ru: [
    { id: "living_room", label: "Гостиная" },
    { id: "dining_room", label: "Столовая" },
    { id: "bedroom",     label: "Спальня" },
    { id: "bathroom",    label: "Ванная" },
    { id: "office",      label: "Офис" },
    { id: "kitchen",     label: "Кухня" },
    { id: "nursery",     label: "Детская" },
    { id: "basement",    label: "Подвал" },
    { id: "balcony",     label: "Балкон / лоджия" },
    { id: "gaming_room", label: "Игровая комната" },
  ],
  en: [
    { id: "living_room", label: "Living room" },
    { id: "dining_room", label: "Dining room" },
    { id: "bedroom",     label: "Bedroom" },
    { id: "bathroom",    label: "Bathroom" },
    { id: "office",      label: "Office" },
    { id: "kitchen",     label: "Kitchen" },
    { id: "nursery",     label: "Nursery" },
    { id: "basement",    label: "Basement" },
    { id: "balcony",     label: "Outdoor Patio" },
    { id: "gaming_room", label: "Gaming Room" },
  ],
};

// Sample "before" room photos
const SAMPLE_ROOMS = [
  {
    id: "sample-bedroom",
    label: { ru: "Спальня", en: "Bedroom" },
    roomType: "bedroom",
    url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=200&q=70",
  },
  {
    id: "sample-living",
    label: { ru: "Гостиная", en: "Living room" },
    roomType: "living_room",
    url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200&q=70",
  },
  {
    id: "sample-kitchen",
    label: { ru: "Кухня", en: "Kitchen" },
    roomType: "kitchen",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70",
  },
];

export default function UploadPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { dict } = useDictionary();
  const { style, setStyle } = useSelectedStyle();

  const [roomTypeOpen, setRoomTypeOpen] = useState(false);
  const roomTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roomTypeRef.current && !roomTypeRef.current.contains(e.target as Node)) {
        setRoomTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [roomType, setRoomType] = useState("bedroom");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roomTypes = ROOM_TYPES[locale as keyof typeof ROOM_TYPES] ?? ROOM_TYPES.en;

  function handleFile(f: File | null) {
    if (!f) { setFile(null); setPreviewUrl(null); return; }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setError(null);
  }

  async function loadSample(sample: typeof SAMPLE_ROOMS[number]) {
    setSampleLoading(sample.id);
    setError(null);
    try {
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const f = new File([blob], `sample-${sample.roomType}.jpg`, { type: "image/jpeg" });
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setRoomType(sample.roomType);
    } catch {
      setError(locale === "ru" ? "Не удалось загрузить пример" : "Failed to load sample");
    } finally {
      setSampleLoading(null);
    }
  }

  async function handleRedesign() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const job = await startRedesign(
        file,
        style.id,
        roomType,
        undefined,
        preferences.trim() || undefined,
      );

      if (!job) throw new Error("Backend unavailable");

      storeJob(job.job_id);
      // DesignProgress in AppShell picks up job_id from localStorage and
      // polls for status — user can navigate freely while it runs
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-bold tracking-tight">{dict.upload.title}</h1>
      <p className="mt-1 text-sm text-muted">{dict.upload.subtitle}</p>

      {/* Room type dropdown */}
      <div className="mt-5" ref={roomTypeRef}>
        <button
          onClick={() => setRoomTypeOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-card/50 px-4 py-3 text-sm font-semibold transition hover:border-coral/60 focus:outline-none"
        >
          <span>{roomTypes.find((rt) => rt.id === roomType)?.label ?? roomTypes[0].label}</span>
          <ChevronDown
            size={18}
            className={`text-muted transition-transform duration-200 ${roomTypeOpen ? "rotate-180" : ""}`}
          />
        </button>

        {roomTypeOpen && (
          <div className="mt-1 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {roomTypes.map((rt) => (
              <button
                key={rt.id}
                onClick={() => { setRoomType(rt.id); setRoomTypeOpen(false); }}
                className="flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-coral/10 active:bg-coral/20"
              >
                <span className={rt.id === roomType ? "font-semibold text-coral" : ""}>{rt.label}</span>
                {rt.id === roomType && <Check size={16} className="text-coral" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upload + sample rooms */}
      <div className="mt-5">
        <UploadDropzone
          onFile={handleFile}
          disabled={loading}
          title={dict.upload.dropzoneTitle}
          hint={dict.upload.dropzoneHint}
          previewUrl={previewUrl}
        />

        {/* Sample room thumbnails */}
        <div className="mt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
            {dict.upload.trySample}
          </p>
          <div className="flex gap-2">
            {SAMPLE_ROOMS.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSample(s)}
                disabled={loading || sampleLoading !== null}
                className={`relative flex-1 overflow-hidden rounded-2xl border-2 transition ${
                  file && previewUrl?.includes("sample") && roomType === s.roomType
                    ? "border-coral"
                    : "border-border hover:border-coral/50"
                }`}
              >
                <div className="aspect-square w-full overflow-hidden bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.thumb}
                    alt={s.label[locale as keyof typeof s.label] ?? s.label.en}
                    className="h-full w-full object-cover"
                  />
                </div>
                {sampleLoading === s.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Loader2 size={16} className="animate-spin text-white" />
                  </div>
                )}
                <p className="py-1 text-center text-[10px] font-semibold text-muted">
                  {s.label[locale as keyof typeof s.label] ?? s.label.en}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inline style picker */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
          {dict.upload.styleTitle}
        </p>

        {/* Featured */}
        <button
          onClick={() => setStyle(STYLES[0])}
          className={`relative block aspect-[16/9] w-full overflow-hidden rounded-3xl text-left ring-2 transition ${
            style.id === STYLES[0].id ? "ring-coral" : "ring-transparent"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={STYLES[0].image}
            alt={STYLES[0].name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-3 left-4 text-xl font-bold text-white">{STYLES[0].name}</span>
          {STYLES[0].trending && (
            <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold tracking-wide">
              TRENDING
            </span>
          )}
        </button>

        {/* Grid */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          {STYLES.slice(1).map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s)}
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
              <span className="absolute bottom-3 left-3 text-base font-bold text-white">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {dict.upload.preferences}
        </p>
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder={dict.upload.preferencesPlaceholder}
          rows={4}
          className="w-full resize-none rounded-2xl border border-border bg-card/40 px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-coral transition"
          style={{ minHeight: "100px" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />
      </div>

      {error && (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Submit */}
      <div className="mt-5">
        <Button disabled={!file || loading} onClick={handleRedesign}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {dict.upload.ctaLoading}
            </>
          ) : (
            <>
              <Sparkles size={18} />
              {dict.upload.cta}
            </>
          )}
        </Button>
        {!file && !loading && (
          <p className="mt-2 text-center text-xs text-muted">{dict.upload.hint}</p>
        )}
      </div>
    </AppShell>
  );
}
