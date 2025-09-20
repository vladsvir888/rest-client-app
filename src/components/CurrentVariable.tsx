import { useTranslations } from 'next-intl';
import { Table, Button, ConfigProvider } from 'antd';
import type { VariableRecord } from '@/types/types';
import { useMemo, useState } from 'react';
import style from './style/CurrentVariable.module.css';

export default function CurrentVariable({
  listVar,
  delVar,
}: {
  listVar: VariableRecord[];
  delVar: (keysToDelete: React.Key[]) => void;
}) {
  const t = useTranslations();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const isDisabled = useMemo(() => selectedRowKeys.length === 0, [selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const deleteVar = () => {
    delVar(selectedRowKeys as string[]);
    setSelectedRowKeys([]);
  };

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
    <div className={style.currentVariable_container}>
      <h3>{t('current_variable')}</h3>
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        dataSource={listVar}
        columns={columns}
        rowKey="key"
      />
      <ConfigProvider
        theme={{
          token: {
            colorTextDisabled: 'rgba(255, 0, 0, 0.7)',
          },
        }}
      >
        <Button
          className={style.form_button}
          type="primary"
          danger={true}
          onClick={deleteVar}
          disabled={isDisabled}
        >
          {t('delete_var')}
        </Button>
      </ConfigProvider>
    </div>
  ) : (
    <h4>{t('no_variables')}</h4>
  );
}
