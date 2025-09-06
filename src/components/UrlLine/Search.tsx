'use client';

import { Button } from 'antd';
import { use, useState } from 'react';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { usePathname } from '@/i18n/navigation';
import cls from './UrlLine.module.css';
import { useSearchParams } from 'next/navigation';

export const Search = () => {
  const [loader, setLoader] = useState(false);
  const { setResponse, errorBody, errorHeader, errorInput } = use(RestClientContext);
  const path = usePathname();
  const queryParams = useSearchParams();

  const error = !errorBody && !errorHeader && !errorInput;

  const handleSend = async () => {
    if (error) {
      setLoader(true);

      setLoader(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleSend} className={!error ? cls['button-disable'] : ''}>
        Send
      </Button>
    </>
  );
};
