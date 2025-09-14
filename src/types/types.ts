export type VariableRecord = {
  key: string;
  variable: string;
  value: string;
};

export type THistory = {
  requestDuration: number;
  responseStatusCode: number;
  requestTimestamp: number | string;
  requestMethod: string;
  requestSize: number;
  responseSize: number;
  errorDetails: string;
  url: string;
  path: string;
  answer: {
    status: number;
    res: string;
  };
  userEmail?: string;
};
