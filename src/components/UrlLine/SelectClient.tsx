'use client';

import { parseUrl } from '@/app/[locale]/rest-client/[[...slug]]/api/parseUrl';
import { methods } from '@/consts/rest-client';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import cls from './UrlLine.module.css';
import { usePathname } from 'next/navigation';

const selects = [...methods].map((method) => ({
  value: method,
  label: method,
}));

export const SelectClient = () => {
  const [select, setSelect] = useState('GET');
  const path = usePathname();

  useEffect(() => {
    async function currentPath() {
      const parse = await parseUrl('http://' + path);
      setSelect(parse.pathSegments[1]);
    }

    currentPath();
  }, [path]);

  const handleSelect = (value: string) => {
    setSelect(value);
    const index = path.indexOf('/', 16);
    window.history.replaceState(
      null,
      '',
      `${path.slice(0, 3)}/rest-client/${value}/${path.slice(index + 1)}`
    );
  };

  return <Select value={select} className={cls.select} onChange={handleSelect} options={selects} />;
};
