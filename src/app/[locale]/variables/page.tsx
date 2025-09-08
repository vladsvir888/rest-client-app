import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CurrentVariable from '@/components/CurrentVariable';
import CreateVariable from '@/components/CreateVariable';

export default function Variables({ authUser }: { authUser: string | false }) {
  const t = useTranslations();

  if (!authUser) redirect('/login');

  return (
    <div className="container">
      <div className="private-layout">
        <h1>{t('variables_page_title')}</h1>
        {typeof authUser === 'string' && (
          <>
            <CurrentVariable authUser={authUser} />
            <CreateVariable authUser={authUser} />
          </>
        )}
      </div>
    </div>
  );
}
