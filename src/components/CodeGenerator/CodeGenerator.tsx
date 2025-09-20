'use client';

import { Input, Select, Typography } from 'antd';
import React, { use, useEffect, useState } from 'react';
import styles from './CodeGenerator.module.css';
import { useTranslations } from 'next-intl';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { convert } from 'postman-code-generators';
import { Request } from 'postman-collection';
import { languages } from '@/consts/languages';
import { usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

export const CodeGenerator = () => {
  const { errorBody, errorHeader, errorInput } = use(RestClientContext);
  const t = useTranslations('restClient');
  const [showCodeGenerate, setShowCodeGenerate] = useState(false);
  const [selectCodeGenerate, setSelectCodeGenerate] = useState('none');
  const [codeGenerate, setCodeGenerate] = useState(``);
  const [disabled, setDisabled] = useState(true);

  const path = usePathname();
  const searchParams = useSearchParams();

  const error = !errorBody && !errorHeader && !errorInput;

  useEffect(() => {
    const generateCode = () => {
      const options = {
        indentCount: 4,
        indentType: 'Space' as const,
        trimRequestBody: true,
        followRedirect: true,
      };

      const urlArr = path.split('/');
      const method = urlArr[2];
      const url = decodeURIComponent(atob(urlArr[3]));
      const body = decodeURIComponent(atob(urlArr[4]));

      const query = searchParams.toString();

      const headers = query
        .split('&')
        .map((item) => {
          const [key, value] = item.split('=');
          return {
            key: decodeURIComponent(key),
            value: decodeURIComponent(value),
          };
        })
        .filter((el) => el.key);

      const customRequest = new Request({
        url,
        method,
        header: headers,
        body: body
          ? {
              mode: 'raw',
              raw: body,
            }
          : undefined,
      });

      convert(
        languages[selectCodeGenerate].lang,
        languages[selectCodeGenerate].variant,
        customRequest,
        options,
        (_, code) => {
          setCodeGenerate(code);
        }
      );
    };
    if (selectCodeGenerate !== 'none') {
      generateCode();
    }

    setDisabled(!decodeURIComponent(atob(path.split('/')[3] ?? '')));
  }, [path, searchParams, selectCodeGenerate]);

  const handleCode = (value: string) => {
    setShowCodeGenerate(value !== 'none');
    setSelectCodeGenerate(value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h3 className={styles.header}>{t('code')}: </h3>
        <Select
          disabled={disabled}
          defaultValue="none"
          className={styles.select}
          onChange={handleCode}
          options={[
            { value: 'none', label: `${t('none')}` },
            { value: 'curl', label: 'cURL' },
            { value: 'fetch', label: 'JavaScript (Fetch api)' },
            { value: 'xhr', label: 'JavaScript (XHR)' },
            { value: 'node', label: 'NodeJS' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'csharp', label: 'C#' },
            { value: 'go', label: 'Go' },
          ]}
        />
      </div>
      {showCodeGenerate && (
        <div className={styles.code}>
          {error ? (
            <Input.TextArea
              rows={10}
              value={codeGenerate}
              readOnly
              style={{
                resize: 'none',
              }}
            />
          ) : (
            <Typography.Text type="danger">
              &nbsp;
              {!error && `${t('generatorError')}`}
            </Typography.Text>
          )}
        </div>
      )}
    </div>
  );
};
