import LogOutButton from './LogOutButton';
import { checkAuth } from '@/app/actions/auth';
import TextLink from '../text-link/TextLink';

export default async function AuthPanel() {
  const { authenticated } = await checkAuth();

  if (authenticated) return <LogOutButton />;

  return (
    <>
      <TextLink href="/sign-in" textKey="sign_in" />
      <TextLink href="/sign-up" textKey="sign_up" />
    </>
  );
}
