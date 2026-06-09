"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { useSelectedStyle } from "@/lib/useSelectedStyle";

export default function UploadPage() {
  const { style } = useSelectedStyle();
  const [file, setFile] = useState<File | null>(null);

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
        <UploadDropzone onFile={setFile} />
      </div>

      <div className="mt-6">
        <Button disabled={!file}>
          <Sparkles size={18} />
          Redesign My Room
        </Button>
        {!file && (
          <p className="mt-2 text-center text-xs text-muted">
            Upload a photo to start
          </p>
        )}
      </div>
    </AppShell>
  );
}
