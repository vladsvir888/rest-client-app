interface ILanguage {
  [key: string]: { [key: string]: string };
}

export const languages: ILanguage = {
  curl: {
    lang: 'curl',
    variant: 'cURL',
  },
  fetch: {
    lang: 'JavaScript',
    variant: 'Fetch',
  },
  xhr: {
    lang: 'JavaScript',
    variant: 'XHR',
  },
  node: {
    lang: 'nodejs',
    variant: 'Native',
  },
  python: {
    lang: 'python',
    variant: 'http.client',
  },
  java: {
    lang: 'java',
    variant: 'OkHttp',
  },
  csharp: {
    lang: 'csharp',
    variant: 'HttpClient',
  },
  go: {
    lang: 'go',
    variant: 'Native',
  },
};
