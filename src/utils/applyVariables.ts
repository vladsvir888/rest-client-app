export function applyVariables(input: string, authUser: string): string {
  const raw = localStorage.getItem(`variable-${authUser}`) || '{}';
  const vars = JSON.parse(raw) as Record<string, string>;

  return input.replace(/\{\{(.*?)\}\}/g, (_, key) => vars[key.trim()] ?? '');
}
