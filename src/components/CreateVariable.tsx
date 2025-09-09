import { Input, Form, Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import style from './style/CreateVariable.module.css';

export default function CreateVariable({
  createVar,
}: {
  createVar: (key: string, value: string) => void;
}) {
  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const t = useTranslations();

  const handleChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value);
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  function createNewVariable() {
    if (!key || !value) return;
    const transformKey = key.trim();
    createVar(transformKey, value);
    setKey('');
    setValue('');
  }

  return (
    <>
      <h3 className={style.form_title}>{t('form_title')}</h3>
      <Form className={style.form_variable}>
        <Input
          className={style.form_input}
          value={key}
          onChange={handleChangeKey}
          placeholder={t('name_var')}
        />
        <Input
          className={style.form_input}
          value={value}
          onChange={handleChangeValue}
          placeholder={t('value_var')}
        />
        <Button className={style.form_button} type="primary" onClick={createNewVariable}>
          {t('create_variable')}
        </Button>
      </Form>
    </>
  );
}
