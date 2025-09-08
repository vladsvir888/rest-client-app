import AuthForm from '@/components/auth/AuthForm';
import AuthRoute from '@/components/auth/AuthRoute';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  return (
    <AuthRoute>
      <div className="container">
        <AuthForm type="login" />
      </div>
    </AuthRoute>
  );
}
