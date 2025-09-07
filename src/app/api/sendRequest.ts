'use server';

export async function sendRequest(method: string, url: string, body: string, headers: Headers) {
  const textBody: undefined | string = method !== 'GET' && body ? body : undefined;

  const requestOptions = {
    method,
    headers,
    body: textBody,
    next: { revalidate: 3600 },
  };

  try {
    const res = await fetch(url, requestOptions);

    if (res.status > 499) {
      return { status: res.status, res: 'Server error' };
    }

    if (res.status > 399) {
      return { status: res.status, res: 'Invalid request' };
    }

    const answer = await res.text();

    return { status: res.status, res: answer };
  } catch {
    return { status: -1, res: 'Network error. Could not send request' };
  }
}
