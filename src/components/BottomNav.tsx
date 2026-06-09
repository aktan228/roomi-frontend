"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Grid3x3, Sparkles, User } from "lucide-react";

const items = [
  { href: "/", label: "DESIGN", icon: LayoutGrid },
  { href: "/gallery", label: "GALLERY", icon: Grid3x3 },
  { href: "/chat", label: "AI CHAT", icon: Sparkles },
  { href: "/profile", label: "PROFILE", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around rounded-3xl border border-border bg-background/95 px-2 py-3 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] backdrop-blur">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-2 text-[11px] font-semibold tracking-wide transition ${
                active ? "text-coral" : "text-muted hover:text-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
