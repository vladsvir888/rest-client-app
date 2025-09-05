'use server';

export const parseUrl = async (url: string) => {
  try {
    const urlObject = new URL(url);
    const path = urlObject.pathname;
    const query = urlObject.searchParams;

    const pathSegments = path.split('/').filter(Boolean);

    return {
      pathSegments,
      query,
    };
  } catch {
    return {
      pathSegments: [''],
      query: new URLSearchParams(),
    };
  }
};
