'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Table } from 'antd';

type VariableRecord = {
  key: string;
  variable: string;
  value: string;
};

export default function CurrentVariable({ authUser }: { authUser: string }) {
  const t = useTranslations();
  const [listVar, setListVar] = useState<VariableRecord[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(`variable-${authUser}`);
    if (raw) {
      try {
        const parsed: Record<string, string> = JSON.parse(raw);
        const formatted = Object.entries(parsed).map(([key, value]) => ({
          key,
          variable: key,
          value,
        }));
        setListVar(formatted);
      } catch (err) {
        console.error('Error parse variable', err);
      }
    }
  }, [authUser]);

  const columns = [
    {
      title: t('key_variable'),
      dataIndex: 'variable',
      key: 'variable',
    },
    {
      title: t('value_variable'),
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return <Table dataSource={listVar} columns={columns} />;
}
