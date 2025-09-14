import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import '../globals.css';
import '@ant-design/v5-patch-for-react-19';
import { Providers } from '../providers';
import { Header } from '@/components/Header/Header';
import { checkAuth } from '../actions/auth';
import { Footer } from '@/components/Footer/Footer';

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

  const user = await checkAuth();

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <Header user={user.authenticated} />
            <div className="wrapper">{children}</div>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
