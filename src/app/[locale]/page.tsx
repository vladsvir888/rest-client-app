import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function HomePage({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const t = useTranslations();

  return (
    <div className="container">
      <header className="header">
        <h1 className="header_title">{t('test_key')}</h1>
        <div className="header_lang">
          <p className="header_lang-title">{t('change_lang')}</p>
          <LanguageSwitcher currentLocale={params.locale} />
        </div>
      </header>

      <main className="main">{children}</main>
    </div>
  );
}
