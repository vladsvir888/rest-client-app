'use client';

export type VariableMap = Record<string, string>;

export function getVariables(authUser: string): VariableMap {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(`variable-${authUser}`) || '{}';
  try {
    return JSON.parse(raw) as VariableMap;
  } catch (err) {
    console.log('message: ', err);
    return {};
  }
}

export function applyVariables(input: string, authUser: string): string {
  const vars = getVariables(authUser);
  return input.replace(/\{\{(.*?)\}\}/g, (_, key) => vars[key.trim()] ?? '');
}
