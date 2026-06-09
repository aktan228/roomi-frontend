import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur">
      <button
        aria-label="Menu"
        className="text-foreground/80 transition hover:text-foreground"
      >
        <Menu size={24} />
      </button>

      <span className="text-xl font-semibold tracking-tight">
        roomi<span className="text-coral">.ai</span>
      </span>

      <div className="h-8 w-8 overflow-hidden rounded-full bg-card ring-1 ring-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.pravatar.cc/64?img=12"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>
    </header>
  );
}
