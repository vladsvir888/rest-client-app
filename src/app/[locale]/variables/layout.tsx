import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Geist, Geist_Mono } from 'next/font/google';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Variable page',
  description: 'Private variable is abailable on this page',
};

export default function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) notFound();

  return <div className={`${geistSans.variable} ${geistMono.variable}`}>{children}</div>;
}
