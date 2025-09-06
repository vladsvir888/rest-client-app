import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '../globals.css';
import Header from '@/components/Header';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'REST Client',
  description: 'REST Client',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <AntdRegistry>
            <Header />
            <div className="wrapper">{children}</div>
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
