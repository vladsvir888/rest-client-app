import '@/app/globals.css';
import '@ant-design/v5-patch-for-react-19';
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'REST Client',
};

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <NextIntlClientProvider>
        <Providers>{children}</Providers>
      </NextIntlClientProvider>
    </AntdRegistry>
  );
}
