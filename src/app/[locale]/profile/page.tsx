import { AppShell } from "@/components/AppShell";
import { getDictionary, isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { DictionaryProvider } from "@/components/DictionaryProvider";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = await getDictionary(locale);

  return (
    <DictionaryProvider dict={dict} locale={locale}>
      <AppShell>
        <h1 className="text-3xl font-bold tracking-tight">{dict.profile.title}</h1>
        <p className="mt-2 text-muted">{dict.profile.subtitle}</p>
        <div className="mt-10 flex h-64 items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/40 text-sm text-muted">
          {dict.common.comingSoon}
        </div>
      </AppShell>
    </DictionaryProvider>
  );
}
