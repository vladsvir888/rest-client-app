'use client';

import { Button } from 'antd';
import { use, useEffect, useState } from 'react';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { usePathname } from '@/i18n/navigation';
import cls from './UrlLine.module.css';
import { validation } from '@/app/[locale]/rest-client/[[...slug]]/api/validation';
import { parseUrl } from '@/app/[locale]/rest-client/[[...slug]]/api/parseUrl';
import { useSearchParams } from 'next/navigation';

export const Search = () => {
  const [loader, setLoader] = useState(false);
  const [valid, setValid] = useState('');
  const { setResponse } = use(RestClientContext);
  const path = usePathname();
  const queryParams = useSearchParams();

  useEffect(() => {
    async function checkValid() {
      const variables = localStorage.getItem('asd') || '{ "foo": "{{BAR}}" }';
      const { pathSegments } = await parseUrl('http://' + path);
      console.log('query', queryParams.toString());
      const res = await validation(
        atob(pathSegments[1]),
        atob(pathSegments[2]),
        'search',
        queryParams.toString(),
        JSON.parse(variables)
      );
      console.log('res', res);
    }

    checkValid();
  }, [path, queryParams]);

  const handleSend = async () => {
    if (valid) {
      setLoader(true);

      setLoader(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleSend} className={!valid ? cls['button-disable'] : ''}>
        Send
      </Button>
    </>
  );
};
