'use client';
import { Input, Select, Typography } from 'antd';
import cls from './Body.module.css';
import { FC, use, useCallback, useEffect, useRef, useState } from 'react';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { usePathname, useSearchParams } from 'next/navigation';
import { validation } from '@/lib/validation';

interface BodyProps {
  body: string;
}

const updateQuery = (search: string, value: string) => {
  let query = '';
  if (query.includes('Content-Type')) {
    query = query
      .split('&')
      .map((el) => {
        if (el.includes('Content-Type')) {
          return `Content-Type=${value}`;
        }
        return el;
      })
      .join('&');
  } else {
    query += `&Content-Type=${value}`;
  }
  return query;
};

export const Body: FC<BodyProps> = ({ body }) => {
  const { setErrorBody } = use(RestClientContext);
  const [error, setError] = useState('');
  const [inputBody, setInputBody] = useState(decodeURIComponent(atob(body)));
  const [showBody, setShowBody] = useState(!!body);
  const [selectBody, setSelectBody] = useState('none');
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const path = usePathname();
  const searchParams = useSearchParams();

  const changeUrl = useCallback(
    (path: string, query: string, input: string = inputBody) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      timerId.current = setTimeout(() => {
        const pathArr = path.split('/');
        const variables = localStorage.getItem('asd') || '{ "фыв": "{{BAR}}" }';
        const res = validation(path, input, 'body', query, JSON.parse(variables));
        let result = '';

        if (res?.error) {
          setErrorBody?.(true);
          setError(res.res as string);
          result = res.origin;
        } else {
          setErrorBody?.(false);
          setError('');
          result = res?.res || '';
        }

        window.history.replaceState(
          {},
          '',
          `/${pathArr[1]}/rest-client/${pathArr[3]}/${pathArr[4] ? pathArr[4] : ''}/${btoa(
            encodeURIComponent(result)
          )}${query ? '?' + query : ''}`
        );
      }, 300);
    },
    [inputBody, setErrorBody]
  );

  const handleSelectBody = useCallback(
    (value: string) => {
      setShowBody(value !== 'none');
      setSelectBody(value);
      let query = searchParams.toString();
      if (value === 'none') {
        setInputBody('');
        query = query
          .split('&')
          .filter((el) => !el.includes('Content-Type'))
          .join('&');
      }

      if (value !== 'json') {
        setErrorBody?.(false);
      }

      if (value === 'json') {
        query = updateQuery(query, 'application%2Fjson');
      }

      if (value === 'text') {
        query = updateQuery(query, 'text%2Fhtml');
      }

      changeUrl(path, query);
    },
    [changeUrl, path, searchParams, setErrorBody]
  );

  useEffect(() => {
    const query = searchParams.get('Content-Type');

    if (query) {
      if (query.includes('json')) {
        handleSelectBody('json');
      }
      if (query.includes('text')) {
        handleSelectBody('text');
      }
    }
  }, [handleSelectBody, searchParams]);

  const handleInputBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputBody(value);

    changeUrl(path, searchParams.toString(), value);
  };

  return (
    <div className={cls.wrapper}>
      {' '}
      <div className={cls.tittle}>
        {' '}
        <h3>{'body'}: </h3>{' '}
        <Select
          value={selectBody}
          className={cls.select}
          onChange={handleSelectBody}
          options={[
            { value: 'none', label: `none` },
            { value: 'json', label: 'JSON' },
            { value: 'text', label: 'Text' },
          ]}
        />{' '}
      </div>{' '}
      {showBody && (
        <Input.TextArea
          status={error ? 'error' : ''}
          style={{ resize: 'none' }}
          rows={10}
          value={inputBody}
          onChange={handleInputBody}
        />
      )}{' '}
      <Typography.Text type="danger"> &nbsp; {error} </Typography.Text>{' '}
    </div>
  );
};
