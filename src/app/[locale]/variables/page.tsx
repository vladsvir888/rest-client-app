import AuthRoute from '@/components/auth/AuthRoute';
import { checkAuth } from '@/app/actions/auth';
import dynamic from 'next/dynamic';

const VariableBlock = dynamic(() => import('../../../components/VariableBlock'));

export default async function Variables() {
  const { userEmail } = await checkAuth();

  return (
    <AuthRoute>
      <div className="container">
        <div className="private-layout">
          <VariableBlock userEmail={userEmail as string} />
        </div>
      </div>
    </AuthRoute>
  );
}
