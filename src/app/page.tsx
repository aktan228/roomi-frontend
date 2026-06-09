"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Sparkles, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { useSelectedStyle } from "@/lib/useSelectedStyle";
import { redesignRoom } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const { style } = useSelectedStyle();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRedesign() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const result = await redesignRoom(file, style.id);

      // Save result to sessionStorage so the result page can access it
      sessionStorage.setItem(`design_${result.design_id}`, JSON.stringify({
        ...result,
        original_preview: URL.createObjectURL(file),
      }));

      router.push(`/design/${result.design_id}?style=${style.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-4 flex justify-end">
        <Link
          href="/style"
          className="inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-md shadow-coral/30"
        >
          <Pencil size={14} />
          {style.name}
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">Upload Room</h1>
      <p className="mt-2 text-muted">
        Let our AI analyze your space and apply the selected style.
      </p>

      <div className="mt-6">
        <UploadDropzone onFile={setFile} disabled={loading} />
      </div>

      {error && (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6">
        <Button disabled={!file || loading} onClick={handleRedesign}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing your room...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Redesign My Room
            </>
          )}
        </Button>
        {!file && !loading && (
          <p className="mt-2 text-center text-xs text-muted">
            Upload a photo to start
          </p>
        )}
      </div>
    </AppShell>
  );
}
