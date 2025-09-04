'use client';

import { methods } from '@/consts/rest-client';
import cls from './UrlLine.module.css';

const selects = [...methods].map((method) => ({
  value: method,
  label: method,
}));

export const UrlLine = () => {
  return <>Url</>;
};
