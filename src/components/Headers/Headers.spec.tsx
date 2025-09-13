import { render, screen, fireEvent, act } from '@testing-library/react';
import { Headers } from './Headers';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { usePathname, useSearchParams } from 'next/navigation';
import { validation } from '@/lib/validation';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'restClient.headers': 'Add Header',
      'restClient.errorVariable': 'Error in variable',
    };
    return translations[key];
  },
}));

vi.mock('@/lib/validation');
vi.mock('@ant-design/icons', () => ({
  CloseOutlined: () => <span data-testid="close-icon">×</span>,
  PlusOutlined: () => <span data-testid="plus-icon">+</span>,
}));

vi.mock('./Headers.module.css', () => ({
  default: {
    wrapper: 'wrapper-mocked',
    error: 'error-mocked',
    'form-line': 'form-line-mocked',
    'form-item': 'form-item-mocked',
  },
}));

const mockSetErrorHeader = vi.fn();
const mockValidation = validation as Mock;
const mockUsePathname = usePathname as Mock;
const mockUseSearchParams = useSearchParams as Mock;

beforeEach(() => {
  vi.clearAllMocks();
  mockUsePathname.mockReturnValue('/en/rest-client/POST/dGVzdC11cmw=/');
  mockUseSearchParams.mockReturnValue(new URLSearchParams());
  Storage.prototype.getItem = vi.fn(() => '{ "foo": "{{BAR}}" }');
  vi.spyOn(window.history, 'replaceState');
  vi.useFakeTimers();
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
  vi.useRealTimers();
});

describe('Headers', () => {
  it('render', () => {
    const headers = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token' },
    ];

    render(
      <RestClientContext.Provider value={{ setErrorHeader: mockSetErrorHeader }}>
        <Headers headers={headers} />
      </RestClientContext.Provider>
    );

    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('add new header', async () => {
    render(
      <RestClientContext.Provider value={{ setErrorHeader: mockSetErrorHeader }}>
        <Headers headers={[]} />
      </RestClientContext.Provider>
    );

    const addButton = screen.getByTestId('plus-icon');
    fireEvent.click(addButton);

    expect(screen.getAllByPlaceholderText('Key')).toHaveLength(1);
    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(1);
  });

  it('remove header', async () => {
    const headers = [{ key: 'Content-Type', value: 'application/json' }];

    render(
      <RestClientContext.Provider value={{ setErrorHeader: mockSetErrorHeader }}>
        <Headers headers={headers} />
      </RestClientContext.Provider>
    );

    expect(screen.queryByPlaceholderText('Key')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Value')).not.toBeInTheDocument();
  });

  it('update URL', async () => {
    mockValidation.mockReturnValue({ res: 'Content-Type=application/json' });

    render(
      <RestClientContext.Provider value={{ setErrorHeader: mockSetErrorHeader }}>
        <Headers headers={[]} />
      </RestClientContext.Provider>
    );

    const addButton = screen.getByTestId('plus-icon');
    fireEvent.click(addButton);

    const keyInput = screen.getByPlaceholderText('Key');
    const valueInput = screen.getByPlaceholderText('Value');

    await act(async () => {
      fireEvent.change(keyInput, { target: { value: 'Content-Type' } });
      fireEvent.change(valueInput, { target: { value: 'application/json' } });
      vi.advanceTimersByTime(300);
    });

    expect(window.history.replaceState).toHaveBeenCalled();
    expect(mockValidation).toHaveBeenCalled();
  });

  it('show error', async () => {
    mockValidation.mockReturnValue({
      error: true,
      res: 'invalid_header',
      origin: 'invalid=header',
    });

    render(
      <RestClientContext.Provider value={{ setErrorHeader: mockSetErrorHeader }}>
        <Headers headers={[]} />
      </RestClientContext.Provider>
    );

    const addButton = screen.getByTestId('plus-icon');
    fireEvent.click(addButton);

    const keyInput = screen.getByPlaceholderText('Key');
    const valueInput = screen.getByPlaceholderText('Value');

    await act(async () => {
      fireEvent.change(keyInput, { target: { value: 'invalid' } });
      fireEvent.change(valueInput, { target: { value: 'header' } });
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('undefined: invalid_header')).toBeInTheDocument();
    expect(mockSetErrorHeader).toHaveBeenCalledWith(true);
  });

  it('parse query', async () => {
    vi.useRealTimers();
    const searchParams = new URLSearchParams();
    searchParams.set('Content-Type', 'application/json');
    searchParams.set('Authorization', 'Bearer token');
    mockUseSearchParams.mockReturnValue(searchParams);

    render(
      <RestClientContext.Provider value={{ setErrorHeader: mockSetErrorHeader }}>
        <Headers headers={[]} />
      </RestClientContext.Provider>
    );

    expect(screen.getAllByPlaceholderText('Key')[0]).toHaveValue('Content-Type');
    expect(screen.getAllByPlaceholderText('Value')[0]).toHaveValue('application/json');
  });
});
