"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Grid3x3, Sparkles, User } from "lucide-react";
import { useDictionary } from "./DictionaryProvider";

export function BottomNav() {
  const pathname = usePathname();
  const { dict, locale } = useDictionary();

  const items = [
    { href: `/${locale}`, label: dict.nav.design, icon: LayoutGrid },
    { href: `/${locale}/gallery`, label: dict.nav.gallery, icon: Grid3x3 },
    { href: `/${locale}/chat`, label: dict.nav.aiChat, icon: Sparkles },
    { href: `/${locale}/profile`, label: dict.nav.profile, icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around rounded-3xl border border-border bg-background/95 px-2 py-3 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] backdrop-blur">
        {items.map(({ href, label, icon: Icon }) => {
          const isHome = href === `/${locale}`;
          const active = isHome
            ? pathname === `/${locale}` || pathname === `/${locale}/`
            : pathname.startsWith(href);
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
