'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Select } from 'antd';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const [locale, setLocale] = useState(currentLocale);

  const handleChange = (newLocale: string) => {
    setLocale(newLocale);
    const params = searchParams.toString();
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath + (params ? '?' + params : ''));
  };

  return (
    <Select
      value={locale}
      style={{ marginLeft: 20 }}
      onChange={handleChange}
      options={routing.locales.map((el) => ({ value: el, label: el }))}
    />
  );
}
