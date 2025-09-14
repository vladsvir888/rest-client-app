'use client';

import { Table } from 'antd';
import type { TableProps } from 'antd';
import { Typography } from 'antd';
import { Flex } from 'antd';
import TextLink from '../text-link/TextLink';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { THistory } from '@/types/types';
import { use } from 'react';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { useTranslations } from 'next-intl';

const { Paragraph, Title } = Typography;

export default function History({ history }: { history: THistory[] }) {
  const router = useRouter();
  const { setResponse } = use(RestClientContext);
  const t = useTranslations();

  if (!history.length)
    return (
      <Flex vertical={true} align="center">
        <Paragraph>{`You haven't executed any requests yet. It's empty here. Try:`}</Paragraph>
        <TextLink href="/rest-client" textKey="restful" />
      </Flex>
    );

  const columns: TableProps<THistory>['columns'] = Object.keys(history[0])
    .filter((key) => key !== 'answer')
    .map((key) => {
      if (key === 'path')
        return {
          title: key,
          dataIndex: key,
          key,
          render: (_, record) => (
            <Button
              type="link"
              onClick={() => {
                setResponse?.(record.answer);
                router.push(record.path);
              }}
            >
              {record.path}
            </Button>
          ),
        };

      return {
        title: key,
        dataIndex: key,
        key,
      };
    });

  const data: THistory[] = history
    .map((item, index) => ({
      ...item,
      key: `${index}`,
      requestTimestamp: new Date(item.requestTimestamp).toLocaleString(),
    }))
    .sort((a, b) => b.requestDuration - a.requestDuration);

  return (
    <>
      <Title style={{ textAlign: 'center' }}>{t('history_requests')}</Title>
      <Table<THistory>
        columns={columns}
        dataSource={data}
        style={{ overflowX: 'auto' }}
        pagination={false}
      />
    </>
  );
}
