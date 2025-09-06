import { FC } from 'react';
import { InputUrl } from './InputUrl';
import { Search } from './Search';
import { SelectClient } from './SelectClient';
import cls from './UrlLine.module.css';

interface UrlLineProps {
  url: string;
  select: string;
}

export const UrlLine: FC<UrlLineProps> = ({ select, url }) => {
  return (
    <div className={cls.wrapper}>
      <SelectClient select={select} />
      <InputUrl url={url} />
      <Search />
    </div>
  );
};
