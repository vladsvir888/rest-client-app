'use client';

import { useTranslations } from 'next-intl';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { Typography } from 'antd';
import { Flex } from 'antd';

const { Title } = Typography;

export default function NotFoundPage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Flex vertical={true} align="center" className="container">
      <Title>404</Title>
      <Button onClick={() => router.push('/')}>{t('return_home')}</Button>
    </Flex>
  );
}
