import { checkAuth } from '@/app/actions/auth';
import AuthRoute from '../auth/AuthRoute';
import VariableTitle from '../VariableTitle';
import VariableInfo from '../VariableInfo';

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
