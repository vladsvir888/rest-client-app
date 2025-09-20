import AuthForm from '@/components/auth/AuthForm';
import AuthRoute from '@/components/auth/AuthRoute';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <AuthRoute>
      <div className="container">
        <AuthForm type="register" />
      </div>
    </AuthRoute>
  );
}
