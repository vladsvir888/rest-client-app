import { regExp } from '@/consts/rest-client';

interface IReplaceVariable {
  type?: string;
  error: boolean;
  origin: string;
  res: string;
}

export const validation = (
  url: string,
  body: string,
  element: string,
  query: string,
  variables: { [key: string]: string }
) => {
  if (element === 'url') {
    return validateUrl(decodeURIComponent(url ?? ''), variables);
  } else if (element === 'body') {
    return validateBody(decodeURIComponent(body ?? ''), decodeURIComponent(query), variables);
  } else if (element === 'headers') {
    return validateHeaders(query, variables);
  }
};

function validateUrl(url: string, variables: { [key: string]: string }): IReplaceVariable {
  if (regExp.test(url)) {
    const res = replaceVariable(url, variables, regExp);

    if (res.status === 'error') {
      return { error: true, res: (res.res as string[]).join(', '), origin: url, type: 'var' };
    }

    if (res.status === 'fulfilled') {
      return { error: false, res: String(res.res), origin: url };
    }
  }

  return { error: false, res: url, origin: url };
}

function validateBody(
  url: string,
  searchParams: string,
  variables: { [key: string]: string }
): IReplaceVariable {
  const typeJSON = searchParams.includes('application/json');

  if (regExp.test(url)) {
    const res = replaceVariable(url, variables, regExp);

    if (res.status === 'error') {
      return { error: true, res: (res.res as string[]).join(', '), origin: url, type: 'var' };
    } else {
      if (typeJSON) {
        return checkJson(res.res as string, url);
      }

      return { error: false, res: res.res as string, origin: url };
    }
  } else {
    if (typeJSON) {
      return checkJson(url, url);
    }
    return { error: false, res: url, origin: url };
  }
}

function validateHeaders(
  searchParams: string,
  variables: { [key: string]: string }
): IReplaceVariable {
  if (regExp.test(searchParams)) {
    const res = replaceVariable(searchParams, variables, regExp);
    if (res.status === 'error') {
      return {
        error: true,
        res: (res.res as string[]).join(', '),
        origin: searchParams,
        type: 'var',
      };
    } else {
      return { error: false, res: res.res as string, origin: searchParams };
    }
  } else {
    return { error: false, res: searchParams, origin: searchParams };
  }
}

function checkJson(json: string, url: string): IReplaceVariable {
  try {
    JSON.parse(json);
    return { error: false, res: json, origin: url };
  } catch {
    return { error: true, res: 'jsonError', origin: url, type: 'json' };
  }
}

/* function replaceVariable(str: string, vars: { [key: string]: string } = {}, regExp: RegExp) {
  const variables = Array.from(new Set(str.match(regExp)));
  const getVariables = variables.map((el) => el.slice(2, -2));
  const nonexistentVariables = getVariables.filter((el) => !Object.keys(vars).includes(el));

  if (str.includes('{{}}')) {
    nonexistentVariables.push('{{}}');
  }

  if (nonexistentVariables.length > 0) {
    return { status: 'error', res: nonexistentVariables.filter(Boolean) };
  }

  let res = str;

  for (const element of variables) {
    const el = element.slice(2, -2);
    res = res.replace(new RegExp(`\\{\\{${el}\\}\\}`, 'g'), String(vars[el]));
  }

  return { status: 'fulfilled', res };
} */

function replaceVariable(str: string, vars: { [key: string]: string } = {}, regExp: RegExp) {
  const variables = Array.from(new Set(str.match(regExp)));
  const getVariables = variables.map((el) => el.slice(2, -2));
  const nonexistentVariables = getVariables.filter(
    (el) =>
      !Object.values(vars)
        .map((el) => el.slice(2, -2))
        .includes(el)
  );

  if (str.includes('{{}}')) {
    nonexistentVariables.push('{{}}');
  }

  if (nonexistentVariables.length > 0) {
    return { status: 'error', res: nonexistentVariables.filter(Boolean) };
  }

  let res = str;

  for (const element of variables) {
    const el = element.slice(2, -2);
    res = res.replace(
      new RegExp(`\\{\\{${el}\\}\\}`, 'g'),
      String(Object.entries(vars).filter((el) => el[1] === element)[0][0])
    );
  }

  return { status: 'fulfilled', res };
}
