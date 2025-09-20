import { FC } from 'react';
import { Body } from '../Body/Body';
import { CodeGenerator } from '../CodeGenerator/CodeGenerator';
import { Headers } from '../Headers/Headers';
import { Response } from '../Response/Response';
import { UrlLine } from '../UrlLine/UrlLine';
import cls from './RestClient.module.css';

interface RestClientProps {
  url: string;
  select: string;
  headers: { key: string; value: string | undefined }[];
  body: string;
  user?: {
    authenticated: boolean;
    userEmail?: string | undefined;
  };
}

export const RestClient: FC<RestClientProps> = (props) => {
  const { body, headers, select, url, user } = props;

  return (
    <div className={cls.wrapper}>
      <UrlLine select={select} url={url} user={user?.userEmail || ''} />
      <Headers headers={headers} user={user?.userEmail || ''} />
      <Body body={body} user={user?.userEmail || ''} />
      <CodeGenerator />
      <Response />
    </div>
  );
};
