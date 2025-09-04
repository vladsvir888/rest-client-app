import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CurrentVariable from '@/components/CurrentVariable';

export default function Variables({
  children,
  authUser,
}: {
  children: React.ReactNode;
  authUser: string | false;
}) {
  const t = useTranslations();
  const isAuth = authUser;

  if (!isAuth) redirect('/login');

  return (
    <div className="private-layout">
      <h1>{t('variables_page_title')}</h1>
      {typeof authUser === 'string' && <CurrentVariable authUser={authUser} />}
    </div>
  );
}
