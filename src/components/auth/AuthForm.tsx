'use client';

// import { login, register } from '@/firebase/handlers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import styles from './auth.module.css';
import { useTranslations } from 'next-intl';
import TextLink from '../text-link/TextLink';
import { login, register } from '@/app/actions/auth';

type FieldType = {
  email: string;
  password: string;
};

type Props = {
  type: 'login' | 'register';
};

export default function AuthForm({ type }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function onCloseAlert() {
    setError(null);
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res =
      type === 'login'
        ? await login(values.email, values.password)
        : await register(values.email, values.password);
    if (typeof res === 'object' && res.error) {
      setError(res.message);
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div className={styles.form}>
      <Form name="basic" onFinish={onFinish} autoComplete="off" layout={'vertical'}>
        <Form.Item<FieldType>
          label={t('email')}
          name="email"
          rules={[
            {
              required: true,
              message: t('input_err_message'),
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={t('password')}
          name="password"
          rules={[
            {
              required: true,
              message: t('input_err_message'),
              pattern: /^(?=.*[A-Za-zА-Яа-я])(?=.*\d)(?=.*[^\w\s]).{8,}$/u,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {t('submit')}
          </Button>
          <TextLink
            href={`/${type === 'login' ? 'sign-up' : 'sign-in'}`}
            textKey={type === 'login' ? 'sign_up' : 'sign_in'}
          />
        </Form.Item>
      </Form>
      {error && <Alert message={error} type="error" closable onClose={onCloseAlert} />}
    </div>
  );
}
