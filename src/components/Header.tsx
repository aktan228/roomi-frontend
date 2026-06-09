"use client";

import Link from "next/link";
import { useDictionary } from "./DictionaryProvider";

export function Header() {
  const { locale } = useDictionary();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur">
      <Link
        href={`/${locale}`}
        className="text-xl font-semibold tracking-tight"
      >
        roomi<span className="text-coral">.ai</span>
      </Link>

      <Link
        href={`/${locale}/profile`}
        aria-label="Profile"
        className="h-8 w-8 overflow-hidden rounded-full bg-card ring-1 ring-border transition hover:ring-coral"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.pravatar.cc/64?img=12"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </Link>
    </header>
  );
}
