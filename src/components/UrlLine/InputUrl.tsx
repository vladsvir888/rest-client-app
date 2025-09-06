'use client';

import { Input, Typography } from 'antd';
import { FC, use, useEffect, useRef, useState } from 'react';
import cls from './UrlLine.module.css';
import { usePathname, useSearchParams } from 'next/navigation';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { validation } from '@/lib/validation';

interface InputUrlProps {
  url: string;
}

export const InputUrl: FC<InputUrlProps> = ({ url }) => {
  const [value, setValue] = useState(decodeURIComponent(atob(url)));
  const [inputError, setInputError] = useState('');
  const { setErrorInput } = use(RestClientContext);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const path = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (url) {
      setErrorInput?.(false);
    }
  }, [url, setErrorInput]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerId.current) clearTimeout(timerId.current);

    const value = e.target.value;

    if (value.length === 0) {
      setErrorInput?.(true);
    }

    setValue(value);

    timerId.current = setTimeout(() => {
      const pathArr = path.split('/');
      const search = searchParams.toString();

      const variables = localStorage.getItem('asd') || '{ "foo": "{{BAR}}" }';

      const res = validation(value, atob(pathArr[5] || ''), 'url', search, JSON.parse(variables));

      let result = '';

      if (res?.error) {
        setErrorInput?.(true);
        setInputError(res.res as string);
        result = res.origin;
      } else {
        setErrorInput?.(false);
        setInputError('');
        result = res?.res || '';
      }

      window.history.replaceState(
        {},
        '',
        `/${pathArr[1]}/rest-client/${pathArr[3]}/${btoa(encodeURIComponent(result))}${
          pathArr[5] ? '/' + pathArr[5] : ''
        }${search ? '?' + search : ''}`
      );
    }, 300);
  };

  return (
    <div className={cls.content_input}>
      <Input
        value={value}
        onChange={handleInput}
        placeholder={'inputPlaceholder'}
        className={cls.input}
        status={inputError.length > 0 ? 'error' : ''}
      />
      <Typography.Text type="danger">&nbsp;{inputError}</Typography.Text>
    </div>
  );
};
