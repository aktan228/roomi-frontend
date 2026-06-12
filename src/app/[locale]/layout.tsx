import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "../globals.css";
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { DictionaryProvider } from "@/components/DictionaryProvider";
import { DesignJobProvider } from "@/lib/design-job";

const comfortaa = Comfortaa({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "roomi.ai — Redesign your room with AI",
  description:
    "Turn any room photo into a beautiful, affordable, shoppable interior with a step-by-step renovation plan.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${comfortaa.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground">
        <DictionaryProvider dict={dict} locale={locale}>
          <DesignJobProvider>
            {children}
          </DesignJobProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}
