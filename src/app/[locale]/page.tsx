import WelcomeBlock from '@/components/welcome-block/WelcomeBlock';
import { checkAuth } from '../actions/auth';

export default async function HomePage() {
  const { authenticated, userEmail } = await checkAuth();

  return (
    <div className="container">
      <WelcomeBlock authenticated={authenticated} userEmail={userEmail} />
    </div>
  );
}
