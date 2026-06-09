import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-border bg-background">
      <Header />
      <main className="flex-1 px-5 pb-32 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
