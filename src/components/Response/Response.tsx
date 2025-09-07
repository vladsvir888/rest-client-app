'use client';

import { Input, Typography } from 'antd';
import { use } from 'react';
import cls from './Response.module.css';
import { useTranslations } from 'next-intl';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';

export const Response = () => {
  const { response } = use(RestClientContext);
  const t = useTranslations('restClient');

  return (
    <div className={cls.wrapper}>
      <h3>{t('response')}</h3>
      <div className={cls.content}>
        <h4>
          {t('status')}:{' '}
          {(response?.status || -1) > -1 && (
            <Typography.Text type={(response?.status || -1) > 399 ? 'danger' : 'success'}>
              {response?.status || -1}
            </Typography.Text>
          )}
        </h4>
        <Input.TextArea
          rows={10}
          value={response?.res || ''}
          readOnly
          style={{
            resize: 'none',
          }}
        />
      </div>
    </div>
  );
};
