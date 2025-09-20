import { checkAuth } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const privateRoutes = ['rest-client', 'variables', 'history'];
const authRoutes = ['sign-in', 'sign-up'];

export default async function AuthRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = await checkAuth();
  const headersList = await headers();
  const headerLink = headersList.get('link')?.split('; ')?.[0]?.replace(/^<|>$/g, '') ?? '';

  if (!authenticated && privateRoutes.some((route) => headerLink.includes(route))) {
    redirect('/');
  }

  if (authenticated && authRoutes.some((route) => headerLink.includes(route))) {
    redirect('/');
  }

  return <>{children}</>;
}
