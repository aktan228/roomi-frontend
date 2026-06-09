import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { DictionaryProvider } from "@/components/DictionaryProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
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
    <html lang={locale} className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground">
        <DictionaryProvider dict={dict} locale={locale}>
          {children}
        </DictionaryProvider>
      </body>
    </html>
  );
}
