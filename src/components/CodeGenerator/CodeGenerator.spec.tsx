import { render, screen, fireEvent, act } from '@testing-library/react';
import { CodeGenerator } from './CodeGenerator';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { useSearchParams } from 'next/navigation';
import { convert } from 'postman-code-generators';
import { Request } from 'postman-collection';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import { usePathname } from '@/i18n/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'restClient.code': 'Code',
      'restClient.none': 'None',
      'restClient.generatorError': 'Error generating code',
    };
    return translations[key];
  },
}));

vi.mock('postman-code-generators', () => ({
  convert: vi.fn(),
}));

vi.mock('postman-collection', () => ({
  Request: vi.fn(),
}));

vi.mock('./CodeGenerator.module.css', () => ({
  default: {
    wrapper: 'wrapper-mocked',
    title: 'title-mocked',
    select: 'select-mocked',
    code: 'code-mocked',
  },
}));

vi.mock('@/consts/languages', () => ({
  languages: {
    curl: { lang: 'curl', variant: 'curl' },
    fetch: { lang: 'javascript', variant: 'fetch' },
    xhr: { lang: 'javascript', variant: 'xhr' },
    node: { lang: 'nodejs', variant: 'request' },
    python: { lang: 'python', variant: 'requests' },
    java: { lang: 'java', variant: 'okhttp' },
    csharp: { lang: 'csharp', variant: 'restsharp' },
    go: { lang: 'go', variant: 'native' },
  },
}));

const mockConvert = convert as Mock;
const mockUsePathname = usePathname as Mock;
const mockUseSearchParams = useSearchParams as Mock;

beforeEach(() => {
  vi.clearAllMocks();
  mockUsePathname.mockReturnValue('/en/rest-client/POST/dGVzdC11cmw=/Ym9keQ==');
  mockUseSearchParams.mockReturnValue(new URLSearchParams('header1=value1&header2=value2'));
  mockConvert.mockImplementation((lang, variant, request, options, callback) => {
    callback(null, 'generated code');
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CodeGenerator', () => {
  it('render', () => {
    render(
      <RestClientContext.Provider
        value={{ errorBody: false, errorHeader: false, errorInput: false }}
      >
        <CodeGenerator />
      </RestClientContext.Provider>
    );

    expect(screen.getByText('undefined')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('show code', async () => {
    render(
      <RestClientContext.Provider
        value={{ errorBody: false, errorHeader: false, errorInput: false }}
      >
        <CodeGenerator />
      </RestClientContext.Provider>
    );

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.mouseDown(select);
    });

    const curlOption = await screen.findByText('cURL');
    await act(async () => {
      fireEvent.click(curlOption);
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('generated code');
  });

  it('show error', async () => {
    render(
      <RestClientContext.Provider
        value={{ errorBody: true, errorHeader: false, errorInput: false }}
      >
        <CodeGenerator />
      </RestClientContext.Provider>
    );

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.mouseDown(select);
    });

    const curlOption = await screen.findByText('cURL');
    await act(async () => {
      fireEvent.click(curlOption);
    });

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('call convert', async () => {
    render(
      <RestClientContext.Provider
        value={{ errorBody: false, errorHeader: false, errorInput: false }}
      >
        <CodeGenerator />
      </RestClientContext.Provider>
    );

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.mouseDown(select);
    });

    const curlOption = await screen.findByText('cURL');
    await act(async () => {
      fireEvent.click(curlOption);
    });

    expect(mockConvert).toHaveBeenCalledWith(
      'curl',
      'curl',
      expect.any(Object),
      {
        indentCount: 4,
        indentType: 'Space',
        trimRequestBody: true,
        followRedirect: true,
      },
      expect.any(Function)
    );
  });

  it('convert error', async () => {
    mockConvert.mockImplementation((lang, variant, request, options, callback) => {
      callback(new Error('Conversion error'), null);
    });

    render(
      <RestClientContext.Provider
        value={{ errorBody: false, errorHeader: false, errorInput: false }}
      >
        <CodeGenerator />
      </RestClientContext.Provider>
    );

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.mouseDown(select);
    });

    const curlOption = await screen.findByText('cURL');
    await act(async () => {
      fireEvent.click(curlOption);
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('parse headers', async () => {
    render(
      <RestClientContext.Provider
        value={{ errorBody: false, errorHeader: false, errorInput: false }}
      >
        <CodeGenerator />
      </RestClientContext.Provider>
    );

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.mouseDown(select);
    });

    const curlOption = await screen.findByText('cURL');
    await act(async () => {
      fireEvent.click(curlOption);
    });

    expect(Request).toHaveBeenCalledWith(
      expect.objectContaining({
        header: [
          { key: 'header1', value: 'value1' },
          { key: 'header2', value: 'value2' },
        ],
      })
    );
  });
});
