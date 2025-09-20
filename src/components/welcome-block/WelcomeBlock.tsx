'use client';

import { GithubOutlined } from '@ant-design/icons';
import { Typography, Flex, List } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
  authenticated: boolean;
  userEmail?: string;
};

const { Title, Paragraph, Link } = Typography;

export default function WelcomeBlock({ authenticated, userEmail }: Props) {
  const t = useTranslations();
  const text = authenticated ? `${t('welcome')}, ${userEmail}!` : `${t('welcome')}!`;

  const data1 = [
    t('main.6'),
    t('main.5'),
    t('main.8'),
    t('main.9'),
    t('main.10'),
    t('main.11'),
    t('main.12'),
  ];
  const data2 = [
    t('main.0'),
    t('main.1'),
    t('main.2'),
    t('main.3'),
    t('main.4'),
    t('main.7'),
    t('main.13'),
  ];
  const data3 = [t('main.14'), t('main.15')];

  return (
    <Flex vertical={true} align="center" gap={20}>
      <Title level={2}>{text}</Title>

      <Flex vertical>
        <Title level={3}>{t('main.title')}</Title>
        <Paragraph>{t('main.project')}</Paragraph>
      </Flex>
      <Flex vertical style={{ alignSelf: 'start' }}>
        <Title level={3}>{t('main.titleDescribe')}</Title>
        <Paragraph>{t('main.describeSchool')}</Paragraph>
      </Flex>

      <Flex vertical align="center">
        <Title level={3}>{t('main.developers')}</Title>

        <Flex gap={20} wrap justify="center">
          <List
            style={{ width: '100%', maxWidth: 400 }}
            size="large"
            header={
              <Link
                href={'https://github.com/vladsvir888'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined style={{ marginRight: 10 }} />
                Vladislav Svirydovich
              </Link>
            }
            bordered
            dataSource={data1}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <List
            style={{ width: '100%', maxWidth: 400 }}
            size="large"
            header={
              <Link href={'https://github.com/totoogg'} target="_blank" rel="noopener noreferrer">
                <GithubOutlined style={{ marginRight: 10 }} />
                Uladzimir Hancharou
              </Link>
            }
            bordered
            dataSource={data2}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <List
            style={{ width: '100%', maxWidth: 400 }}
            size="large"
            header={
              <Link
                href={'https://github.com/ivan1antonov'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined style={{ marginRight: 10 }} />
                Ivan Antonov
              </Link>
            }
            bordered
            dataSource={data3}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
