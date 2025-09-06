'use client';

import { methods } from '@/consts/rest-client';
import { Select } from 'antd';
import { FC, useState } from 'react';
import cls from './UrlLine.module.css';
import { usePathname, useSearchParams } from 'next/navigation';

interface SelectClientProps {
  select: string;
}

const selects = [...methods].map((method) => ({
  value: method,
  label: method,
}));

export const SelectClient: FC<SelectClientProps> = ({ select: startSelect }) => {
  const [select, setSelect] = useState(startSelect);
  const path = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (value: string) => {
    setSelect(value);
    const index = path.indexOf('/', 16) === -1 ? path.length - 1 : path.indexOf('/', 16);

    const search = searchParams.toString();

    window.history.replaceState(
      {},
      '',
      `${path.slice(0, 3)}/rest-client/${value}/${path.slice(index + 1)}${
        search ? '?' + search : ''
      }`
    );
  };

  return <Select value={select} className={cls.select} onChange={handleSelect} options={selects} />;
};
