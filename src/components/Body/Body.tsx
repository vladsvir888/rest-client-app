'use client';
import { Input, Select, Typography } from 'antd';
import cls from './Body.module.css';
import { FC, use, useCallback, useEffect, useRef, useState } from 'react';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { useSearchParams } from 'next/navigation';
import { validation } from '@/lib/validation';
import { useTranslations } from 'next-intl';

interface BodyProps {
  body: string;
  user?: string;
}

const updateQuery = (search: string, value: string) => {
  let query = search;
  if (search.includes('Content-Type')) {
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

export const Body: FC<BodyProps> = ({ body, user }) => {
  const { setErrorBody } = use(RestClientContext);
  const [error, setError] = useState('');
  const [inputBody, setInputBody] = useState(decodeURIComponent(atob(body ?? '')));
  const [showBody, setShowBody] = useState(!!body);
  const [jsonError, setJsonError] = useState(false);
  const [first, setFirst] = useState(true);
  const [selectBody, setSelectBody] = useState('none');
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const t = useTranslations('restClient');

  const changeUrl = useCallback(
    (query: string, input?: string) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      timerId.current = setTimeout(() => {
        const pathArr = window.location.href.split('/');

        const select = pathArr[5]?.split('?')[0];
        const url = pathArr[6]?.split('?')[0];

        const variables = localStorage.getItem(`variable-${user}`) || '{}';
        const res = validation(
          '',
          input ?? atob(pathArr[7]?.split('?')?.[0] ?? ''),
          'body',
          query,
          JSON.parse(variables)
        );
        let result = '';

        if (res?.type === 'json') {
          setJsonError(true);
        } else {
          setJsonError(false);
        }

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
          `/${pathArr[3]}/rest-client/${select}/${url ? url : ''}/${btoa(
            encodeURIComponent(result)
          )}?${query ? query : ''}`
        );
      }, 300);
    },
    [setErrorBody, user]
  );

  const handleSelectBody = useCallback(
    (value: string, search: string) => {
      setShowBody(value !== 'none');
      setSelectBody(value);
      let query = search;

      if (value !== 'json') {
        setErrorBody?.(false);
      }

      if (value === 'json') {
        query = updateQuery(query, 'application%2Fjson');
      }

      if (value === 'text') {
        query = updateQuery(query, 'text%2Fhtml');
      }

      if (value === 'none') {
        setInputBody('');

        query = query
          .split('&')
          .filter((el) => !el.includes('Content-Type'))
          .join('&');

        changeUrl(query, '');
      } else {
        changeUrl(query);
      }
    },
    [changeUrl, setErrorBody]
  );

  useEffect(() => {
    const query = searchParams.get('Content-Type');

    if (query) {
      if (query.includes('json')) {
        handleSelectBody('json', searchParams.toString());
        if (first) {
          setFirst(false);
          try {
            setInputBody(JSON.stringify(JSON.parse(decodeURIComponent(atob(body))), null, 4));
          } catch {
            setInputBody('');
          }
        }
      }
      if (query.includes('text')) {
        handleSelectBody('text', searchParams.toString());
      }
    } else {
      handleSelectBody('none', searchParams.toString());
    }
  }, [body, first, handleSelectBody, searchParams]);

  const handleInputBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputBody(value);

    changeUrl(searchParams.toString(), value);
  };

  return (
    <div className={cls.wrapper}>
      <div className={cls.tittle}>
        <h3 className={cls.header}>{t('body')}: </h3>
        <Select
          value={selectBody}
          className={cls.select}
          onChange={(e) => handleSelectBody(e, searchParams.toString())}
          options={[
            { value: 'none', label: `${t('none')}` },
            { value: 'json', label: 'JSON' },
            { value: 'text', label: 'Text' },
          ]}
        />
      </div>
      {showBody && (
        <Input.TextArea
          status={error ? 'error' : ''}
          style={{ resize: 'none' }}
          rows={10}
          value={inputBody}
          onChange={handleInputBody}
        />
      )}
      <Typography.Text type="danger">
        &nbsp;
        {error && (jsonError ? `${t('bodyError')}` : `${t('errorVariable')}: ${error}`)}
      </Typography.Text>
    </div>
  );
};
