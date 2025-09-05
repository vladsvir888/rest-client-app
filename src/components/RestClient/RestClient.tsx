import { Body } from '../Body/Body';
import { CodeGenerator } from '../CodeGenerator/CodeGenerator';
import { Headers } from '../Headers/Headers';
import { Response } from '../Response/Response';
import { RestClientProvider } from '../RestClientProvider/RestClientProvider';
import { UrlLine } from '../UrlLine/UrlLine';
import cls from './RestClient.module.css';

export const RestClient = () => {
  return (
    <RestClientProvider>
      <div className={cls.wrapper}>
        <UrlLine />
        <Headers />
        <Body />
        <CodeGenerator />
        <Response />
      </div>
    </RestClientProvider>
  );
};
