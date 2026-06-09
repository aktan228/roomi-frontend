import { AppShell } from "./AppShell";

export function Placeholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted">{subtitle}</p>
      <div className="mt-10 flex h-64 items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/40 text-sm text-muted">
        Coming soon
      </div>
    </AppShell>
  );
}
