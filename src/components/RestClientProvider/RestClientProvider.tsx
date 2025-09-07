'use client';

import { createContext, FC, useMemo, useState } from 'react';

type response = {
  status: number;
  res: string;
};

interface IRestClientContext {
  response?: response;
  setResponse?: (response: response) => void;
  errorInput?: boolean;
  setErrorInput?: (errorInput: boolean) => void;
  errorBody?: boolean;
  setErrorBody?: (errorBody: boolean) => void;
  errorHeader?: boolean;
  setErrorHeader?: (errorHeader: boolean) => void;
}

interface IRestClientProvider {
  children: React.ReactNode;
}

export const RestClientContext = createContext<IRestClientContext>({});

export const RestClientProvider: FC<IRestClientProvider> = ({ children }) => {
  const [response, setResponse] = useState<response>({ res: '', status: -1 });
  const [errorInput, setErrorInput] = useState<boolean>(true);
  const [errorBody, setErrorBody] = useState<boolean>(false);
  const [errorHeader, setErrorHeader] = useState<boolean>(false);

  const defaultValue = useMemo(
    () => ({
      response,
      setResponse,
      errorInput,
      setErrorInput,
      errorBody,
      setErrorBody,
      errorHeader,
      setErrorHeader,
    }),
    [errorBody, errorHeader, errorInput, response]
  );

  return <RestClientContext value={defaultValue}>{children}</RestClientContext>;
};
