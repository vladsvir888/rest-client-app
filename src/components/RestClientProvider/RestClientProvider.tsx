'use client';

import { createContext, FC, useMemo, useState } from 'react';

type response = {
  status: number;
  res: string;
};

interface IRestClientContext {
  response?: response;
  setResponse?: (response: response) => void;
}

interface IRestClientProvider {
  children: React.ReactNode;
}

export const RestClientContext = createContext<IRestClientContext>({});

export const RestClientProvider: FC<IRestClientProvider> = ({ children }) => {
  const [response, setResponse] = useState<response>({ res: '', status: -1 });

  const defaultValue = useMemo(
    () => ({
      response,
      setResponse,
    }),
    [response]
  );

  return <RestClientContext value={defaultValue}>{children}</RestClientContext>;
};
