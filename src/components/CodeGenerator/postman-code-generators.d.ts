declare module 'postman-code-generators' {
  interface ConvertOptions {
    indentCount?: number;
    indentType?: 'Space' | 'Tab';
    trimRequestBody?: boolean;
    followRedirect?: boolean;
  }

  export function convert(
    language: string,
    variant: string,
    request: ReturnType<typeof Request>,
    options?: ConvertOptions,
    callback: (...args: ReturnType<typeof getArgs>) => void
  ): string;
}
