'use client';

import { Divider, Typography, Flex } from 'antd';
import TextLink from '../text-link/TextLink';
import { useTranslations } from 'next-intl';

type Props = {
  authenticated: boolean;
  userEmail?: string;
};

const { Paragraph } = Typography;

export default function WelcomeBlock({ authenticated, userEmail }: Props) {
  const t = useTranslations();
  const text = authenticated ? `${t('welcome')}, ${userEmail}!` : `${t('welcome')}!`;

  return (
    <Flex vertical={true} align="center">
      <Paragraph>{text}</Paragraph>
      <Divider />
      <Flex>
        {authenticated ? (
          <>
            <TextLink href="/rest-client" textKey="restful" />
            <TextLink href="/history" textKey="history" />
            <TextLink href="/variables" textKey="variables" />
          </>
        ) : (
          <>
            <TextLink href="/sign-in" textKey="sign_in" />
            <TextLink href="/sign-up" textKey="sign_up" />
          </>
        )}
      </Flex>
    </Flex>
  );
}
