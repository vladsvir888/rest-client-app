'use server';

import { addHistory } from '../actions/history';

export async function sendRequest(
  method: string,
  url: string,
  body: string,
  headers: Headers,
  path: string
) {
  const textBody: undefined | string = method !== 'GET' && body ? body : undefined;

  const requestOptions = {
    method,
    headers,
    body: textBody,
    next: { revalidate: 3600 },
  };

  const requestSize = textBody ? Buffer.byteLength(textBody as string, 'utf8') : 0;
  const requestTimestamp = Date.now();

  try {
    let responseSize = 0;
    let errorDetails = '';
    const startTime = Date.now();
    const res = await fetch(url, requestOptions);
    const requestDuration = Date.now() - startTime;
    const responseStatusCode = res.status;

    if (res.status > 499) {
      errorDetails = 'Server error';
      await addHistory({
        requestDuration,
        responseStatusCode,
        requestTimestamp,
        requestMethod: method,
        requestSize,
        responseSize,
        errorDetails,
        url,
        path,
        answer: {
          status: res.status,
          res: errorDetails,
        },
      });
      return { status: res.status, res: errorDetails };
    }

    if (res.status > 399) {
      errorDetails = 'Invalid request';
      await addHistory({
        requestDuration,
        responseStatusCode,
        requestTimestamp,
        requestMethod: method,
        requestSize,
        responseSize,
        errorDetails,
        url,
        path,
        answer: {
          status: res.status,
          res: errorDetails,
        },
      });
      return { status: res.status, res: errorDetails };
    }

    const answer = await res.text();
    responseSize = Buffer.byteLength(answer, 'utf8');

    await addHistory({
      requestDuration,
      responseStatusCode,
      requestTimestamp,
      requestMethod: method,
      requestSize,
      responseSize,
      errorDetails,
      url,
      path,
      answer: {
        status: res.status,
        res: answer,
      },
    });

    return { status: res.status, res: answer };
  } catch {
    const errorDetails = 'Network error. Could not send request';
    await addHistory({
      requestDuration: 0,
      responseStatusCode: -1,
      requestTimestamp,
      requestMethod: method,
      requestSize,
      responseSize: 0,
      errorDetails,
      url,
      path,
      answer: {
        status: -1,
        res: errorDetails,
      },
    });
    return { status: -1, res: errorDetails };
  }
}
