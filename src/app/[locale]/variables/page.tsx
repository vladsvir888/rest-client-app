import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import VariableInfo from '@/components/VariableInfo';

export default function Variables({ authUser }: { authUser: string | false }) {
  const t = useTranslations();

  // if (!authUser) redirect('/login');
  const user = 'user1';

  return (
    <div className="container">
      <div className="private-layout">
        <h1>{t('variables_page_title')}</h1>
        {/* {typeof authUser === 'string' && (
          <> */}
        <VariableInfo authUser={user} />
        {/* </>
        )} */}
      </div>
    </div>
  );
}
