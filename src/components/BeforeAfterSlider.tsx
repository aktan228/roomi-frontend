"use client";

import { useRef, useState } from "react";

export function BeforeAfterSlider({
  before,
  after,
  labelBefore = "Before",
  labelAfter = "After",
}: {
  before: string;
  after: string;
  labelBefore?: string;
  labelAfter?: string;
}) {
  const [pos, setPos] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);

  function updatePos(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-3xl"
      onMouseMove={(e) => e.buttons === 1 && updatePos(e.clientX)}
      onTouchMove={(e) => updatePos(e.touches[0].clientX)}
    >
      {/* After (full) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="After redesign" className="absolute inset-0 h-full w-full object-cover" />

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="Before" className="absolute inset-0 h-full object-cover" style={{ width: containerRef.current?.offsetWidth ?? 400 }} />
      </div>

      {/* Divider */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 cursor-ew-resize bg-white shadow-lg"
        style={{ left: `${pos}%` }}
        onMouseDown={(e) => {
          e.preventDefault();
          const move = (ev: MouseEvent) => updatePos(ev.clientX);
          const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", up);
        }}
        onTouchStart={() => {/* handled by parent */}}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
          <span className="text-xs font-bold text-foreground">⇔</span>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">{labelBefore}</span>
      <span className="absolute bottom-3 right-3 rounded-full bg-coral/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">{labelAfter}</span>
    </div>
  );
}
