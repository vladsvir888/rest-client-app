import { useTranslations } from 'next-intl';
import VariableInfo from '@/components/VariableInfo';
import AuthRoute from '@/components/auth/AuthRoute';

export default function Variables() {
  const t = useTranslations();

  // if (!authUser) redirect('/login');
  const user = 'user1';

  return (
    <AuthRoute>
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
    </AuthRoute>
  );
}
