import { getHistory } from '@/app/actions/history';
import AuthRoute from '@/components/auth/AuthRoute';
import { THistory } from '@/types/types';
import dynamic from 'next/dynamic';

const History = dynamic(() => import('../../../components/history/History'));

export default async function HistoryPage() {
  const history = (await getHistory()) as THistory[];

  return (
    <AuthRoute>
      <div className="container">
        <History history={history} />
      </div>
    </AuthRoute>
  );
}
