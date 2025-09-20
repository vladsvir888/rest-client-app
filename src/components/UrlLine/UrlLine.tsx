import { FC } from 'react';
import { InputUrl } from './InputUrl';
import { Search } from './Search';
import { SelectClient } from './SelectClient';
import cls from './UrlLine.module.css';
import { useTranslations } from 'next-intl';

interface UrlLineProps {
  url: string;
  select: string;
  user?: string;
}

export const UrlLine: FC<UrlLineProps> = ({ select, url, user }) => {
  const t = useTranslations('restClient');

  return (
    <>
      <h2>REST {t('title')}</h2>
      <div className={cls.wrapper}>
        <SelectClient select={select} />
        <InputUrl url={url} user={user} />
        <Search />
      </div>
    </>
  );
};
