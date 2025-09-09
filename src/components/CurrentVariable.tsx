import { useTranslations } from 'next-intl';
import { Table } from 'antd';
import type { VariableRecord } from '@/types/types';

export default function CurrentVariable({ listVar }: { listVar: VariableRecord[] }) {
  const t = useTranslations();

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
    <Table dataSource={listVar} columns={columns} rowKey="key" />
  ) : (
    <h4>{t('no_variables')}</h4>
  );
}
