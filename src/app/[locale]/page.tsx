import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Header from '@/components/Header';

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
      <Header params={params} />
      <main className="main">{children}</main>
    </div>
  );
}
