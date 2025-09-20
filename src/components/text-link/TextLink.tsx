'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

type Props = {
  textKey: string;
  href: string;
};

export default function TextLink({ textKey, href }: Props) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Button type="link" onClick={() => router.push(href)}>
      {t(textKey)}
    </Button>
  );
}
