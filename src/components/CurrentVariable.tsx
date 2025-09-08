'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Table } from 'antd';
import { getVariables } from '@/utils/applyVariables';

type VariableRecord = {
  key: string;
  variable: string;
  value: string;
};

export default function CurrentVariable({ authUser }: { authUser: string }) {
  const t = useTranslations();
  const [listVar, setListVar] = useState<VariableRecord[]>([]);

  useEffect(() => {
    const parsed = getVariables(authUser);
    const formatted = Object.entries(parsed).map(([key, value]) => ({
      key,
      variable: key,
      value,
    }));
    setListVar(formatted);
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

  return listVar.length > 0 ? (
    <Table dataSource={listVar} columns={columns} />
  ) : (
    <h4>{t('no_variables')}</h4>
  );
}
