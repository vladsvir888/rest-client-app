'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';

export default function LogOutButton() {
  const router = useRouter();
  const t = useTranslations();

  async function handleClick() {
    await logout();
    router.refresh();
  }

  return <Button onClick={handleClick}>{t('sign_out')}</Button>;
}
