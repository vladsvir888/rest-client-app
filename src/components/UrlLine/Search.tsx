'use client';

import { Button } from 'antd';
import { use, useState } from 'react';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { usePathname } from '@/i18n/navigation';
import cls from './UrlLine.module.css';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader } from '../Loader/Loader';
import { sendRequest } from '@/app/api/sendRequest';

export const Search = () => {
  const [loader, setLoader] = useState(false);
  const { setResponse, errorBody, errorHeader, errorInput } = use(RestClientContext);
  const t = useTranslations('restClient');

  const path = usePathname();
  const queryParams = useSearchParams();

  const error = !errorBody && !errorHeader && !errorInput;

  const handleSend = async () => {
    if (error) {
      setLoader(true);

      const urlArr = path.split('/');
      const method = urlArr[2];
      const url = decodeURIComponent(atob(urlArr[3]));
      const body = decodeURIComponent(atob(urlArr[4] || ''));
      const headers = new Headers();

      queryParams.forEach((value, key) => {
        if (key) {
          headers.append(decodeURIComponent(key), decodeURIComponent(value));
        }
      });

      let result = await sendRequest(method, url, body, headers, path);

      if (result.res === 'Server error') {
        result = {
          ...result,
          res: `${t('serverError')}`,
        };
      } else if (result.res === 'Invalid request') {
        result = {
          ...result,
          res: `${t('requestError')}`,
        };
      } else if (result.res === 'Network error. Could not send request') {
        result = {
          ...result,
          res: `${t('networkError')}`,
        };
      }

      setResponse?.(result);

      setLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Button type="primary" onClick={handleSend} className={!error ? cls['button-disable'] : ''}>
        {`${t('send')}`}
      </Button>
    </>
  );
};
