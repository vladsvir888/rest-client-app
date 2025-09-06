import { FC } from 'react';
import { Body } from '../Body/Body';
import { CodeGenerator } from '../CodeGenerator/CodeGenerator';
import { Headers } from '../Headers/Headers';
import { Response } from '../Response/Response';
import { RestClientProvider } from '../RestClientProvider/RestClientProvider';
import { UrlLine } from '../UrlLine/UrlLine';
import cls from './RestClient.module.css';

interface RestClientProps {
  url: string;
  select: string;
  headers: string;
  body: string;
}

export const RestClient: FC<RestClientProps> = (props) => {
  const { body, headers, select, url } = props;

  return (
    <RestClientProvider>
      <div className={cls.wrapper}>
        <UrlLine select={select} url={url} />
        <Headers />
        <Body />
        <CodeGenerator />
        <Response />
      </div>
    </RestClientProvider>
  );
};
