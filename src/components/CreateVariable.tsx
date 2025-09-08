'use client';

import { Input, Form, Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import style from './style/CreateVariable.module.css';

export default function CreateVariable({ authUser }: { authUser: string | false }) {
  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const t = useTranslations();

  const handleChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value);
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleCreateVariable = () => {
    if (!key || !value) return;
    const raw = localStorage.getItem(`variable-${authUser}`) || '{}';
    const parsed = JSON.parse(raw);
    parsed[key] = value;
    localStorage.setItem(`variable-${authUser}`, JSON.stringify(parsed));
    setKey('');
    setValue('');
  };

  return (
    <>
      <h3 className={style.form_title}>{t('form_title')}</h3>
      <Form className={style.form_variable}>
        <Input style={{ width: 300 }} value={key} onChange={handleChangeKey} />
        <Input style={{ width: 300 }} value={value} onChange={handleChangeValue} />
        <Button style={{ width: 100 }} type="primary" onClick={handleCreateVariable}>
          {t('create_variable')}
        </Button>
      </Form>
    </>
  );
}
