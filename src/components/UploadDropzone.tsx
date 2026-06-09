"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

export function UploadDropzone({
  onFile,
  disabled = false,
}: {
  onFile?: (file: File | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0] ?? null;
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onFile?.(file);
    }
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    onFile?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={`relative flex aspect-[4/5] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${dragging ? "border-coral bg-coral-light" : "border-border bg-card/40"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Room preview"
            className="absolute inset-0 h-full w-full rounded-3xl object-cover"
          />
          <button
            onClick={clear}
            aria-label="Remove photo"
            className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
          >
            <X size={18} />
          </button>
        </>
      ) : (
        <>
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-coral-light">
            <Camera className="text-coral" size={28} />
          </div>
          <p className="text-lg font-semibold">Upload your room photo</p>
          <p className="mt-1 text-sm text-muted">Tap to browse or drag and drop</p>
        </>
      )}
    </div>
  );
}
