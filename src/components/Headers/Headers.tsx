'use client';

import { Button, Form, Input, Typography } from 'antd';
import cls from './Headers.module.css';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { FC, use, useCallback, useEffect, useState } from 'react';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { useForm } from 'antd/es/form/Form';
import { validation } from '@/lib/validation';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface HeadersProps {
  headers: { key: string; value: string | undefined }[];
  user?: string;
}

export const Headers: FC<HeadersProps> = ({ headers, user }) => {
  const { setErrorHeader } = use(RestClientContext);
  const [error, setError] = useState('');
  const [form] = useForm();
  const t = useTranslations('restClient');

  const path = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    form.setFieldsValue({
      headers,
    });
  }, [form, headers]);

  useEffect(() => {
    const query = searchParams.toString();

    if (query) {
      const headers = query.split('&').map((el) => {
        const [key, value] = el.split('=');

        return {
          key: decodeURIComponent(key),
          value: decodeURIComponent(value),
        };
      });

      form.setFieldsValue({
        headers,
      });
    } else {
      form.setFieldsValue({
        headers: [],
      });
    }
  }, [form, searchParams]);

  const handleChangeHeader = useCallback(() => {
    let timerId = '' as unknown as NodeJS.Timeout;

    return () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        const headers = form
          .getFieldsValue(['headers', 'key', 'value'])
          .headers.map((el: { key: string | undefined; value: string | undefined }) => {
            const obj = el ?? {};

            return `${obj.key ?? ''}=${obj.value ?? ''}`;
          })
          .join('&');

        const pathArr = path.split('/');

        const variables = localStorage.getItem(`variable-${user}`) || '{}';

        const res = validation(
          path,
          atob(pathArr[5] || ''),
          'headers',
          headers,
          JSON.parse(variables)
        );

        let result = '';

        if (res?.error) {
          setErrorHeader?.(true);
          setError(res.res as string);
          result = res.origin;
        } else {
          setErrorHeader?.(false);
          setError('');
          result = res?.res || '';
        }

        window.history.replaceState(
          {},
          '',
          `/${pathArr[1]}/rest-client/${pathArr[3]}/${pathArr[4] ? pathArr[4] : ''}/${
            pathArr[5] ? pathArr[5] : ''
          }?${result ? result : ''}`
        );
      }, 300);
    };
  }, [form, path, setErrorHeader, user]);

  return (
    <>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onChange={handleChangeHeader()}
        className={cls.wrapper}
        autoComplete="off"
      >
        <Form.List name="headers">
          {(fields, { add, remove }) => (
            <div className={error.length > 0 ? cls.error : ''}>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                    handleChangeHeader()();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  {t('headers')}
                </Button>
              </Form.Item>

              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className={cls['form-line']}>
                  <Form.Item {...restField} name={[name, 'key']} className={cls['form-item']}>
                    <Input placeholder="Key" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'value']} className={cls['form-item']}>
                    <Input placeholder="Value" />
                  </Form.Item>
                  <CloseOutlined
                    onClick={() => {
                      remove(name);
                      handleChangeHeader()();
                    }}
                    style={{ fontSize: '32px', color: 'red' }}
                  />
                </div>
              ))}
            </div>
          )}
        </Form.List>
        <Typography.Text type="danger">
          &nbsp;
          {error.length > 0 && `${t('errorVariable')}: ${error}`}
        </Typography.Text>
      </Form>
    </>
  );
};
