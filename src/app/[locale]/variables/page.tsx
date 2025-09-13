import VariableInfo from '@/components/VariableInfo';
import AuthRoute from '@/components/auth/AuthRoute';
import { checkAuth } from '@/app/actions/auth';
import VariableTitle from '@/components/VariableTitle';

export default async function Variables() {
  const { userEmail } = await checkAuth();

  return (
    <AuthRoute>
      <div className="container">
        <div className="private-layout">
          <VariableTitle />
          <VariableInfo authUser={userEmail as string} />
        </div>
      </div>
    </AuthRoute>
  );
}
