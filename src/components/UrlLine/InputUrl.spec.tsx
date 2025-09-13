import { render, screen, fireEvent, act } from '@testing-library/react';
import { InputUrl } from './InputUrl';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { validation } from '@/lib/validation';
import { usePathname, useSearchParams } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/lib/validation');
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      inputPlaceholder: 'Enter URL',
      errorVariable: 'Error in variable',
      urlErrorFill: 'Please fill URL',
    };
    return translations[key];
  },
}));

const mockSetErrorInput = vi.fn();
const mockValidation = validation as Mock;
const mockUsePathname = usePathname as Mock;
const mockUseSearchParams = useSearchParams as Mock;

beforeEach(() => {
  mockUsePathname.mockReturnValue('/en/rest-client/123/');
  mockUseSearchParams.mockReturnValue(new URLSearchParams());
  vi.useFakeTimers();
  Storage.prototype.getItem = vi.fn(() => '{ "foo": "{{BAR}}" }');
  vi.spyOn(window.history, 'replaceState');
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('InputUrl', () => {
  it('render', () => {
    const testUrl = 'https://example.com';
    const encodedUrl = btoa(encodeURIComponent(testUrl));

    render(
      <RestClientContext.Provider value={{ setErrorInput: mockSetErrorInput }}>
        <InputUrl url={encodedUrl} />
      </RestClientContext.Provider>
    );

    expect(screen.getByDisplayValue(testUrl)).toBeInTheDocument();
  });

  it('update', async () => {
    const testUrl = 'https://example.com';
    const encodedUrl = btoa(encodeURIComponent(testUrl));
    mockValidation.mockReturnValue({ res: 'https://updated.com' });

    render(
      <RestClientContext.Provider value={{ setErrorInput: mockSetErrorInput }}>
        <InputUrl url={encodedUrl} />
      </RestClientContext.Provider>
    );

    const input = screen.getByPlaceholderText('Enter URL');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://updated.com' } });
      vi.advanceTimersByTime(300);
    });

    expect(window.history.replaceState).toHaveBeenCalled();
  });

  it('empty input', async () => {
    const testUrl = 'https://example.com';
    const encodedUrl = btoa(encodeURIComponent(testUrl));

    render(
      <RestClientContext.Provider value={{ setErrorInput: mockSetErrorInput }}>
        <InputUrl url={encodedUrl} />
      </RestClientContext.Provider>
    );

    const input = screen.getByPlaceholderText('Enter URL');

    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });

    expect(screen.getByText('Please fill URL')).toBeInTheDocument();
    expect(mockSetErrorInput).toHaveBeenCalledWith(true);
  });

  it('check timeout', async () => {
    const testUrl = 'https://example.com';
    const encodedUrl = btoa(encodeURIComponent(testUrl));
    mockValidation.mockReturnValue({ res: 'https://updated.com' });

    render(
      <RestClientContext.Provider value={{ setErrorInput: mockSetErrorInput }}>
        <InputUrl url={encodedUrl} />
      </RestClientContext.Provider>
    );

    const input = screen.getByPlaceholderText('Enter URL');
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'first' } });
      vi.advanceTimersByTime(100);
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'second' } });
      vi.advanceTimersByTime(300);
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('use variables', async () => {
    const testUrl = 'https://example.com';
    const encodedUrl = btoa(encodeURIComponent(testUrl));
    const mockVariables = '{ "test": "value" }';
    Storage.prototype.getItem = vi.fn(() => mockVariables);
    mockValidation.mockReturnValue({ res: 'https://valid.com' });

    render(
      <RestClientContext.Provider value={{ setErrorInput: mockSetErrorInput }}>
        <InputUrl url={encodedUrl} />
      </RestClientContext.Provider>
    );

    const input = screen.getByPlaceholderText('Enter URL');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://test.com' } });
      vi.advanceTimersByTime(300);
    });

    expect(localStorage.getItem).toHaveBeenCalledWith('variable-undefined');
    expect(validation).toHaveBeenCalledWith(
      'https://test.com',
      '',
      'url',
      '',
      JSON.parse(mockVariables)
    );
  });

  it('set error input', () => {
    const testUrl = 'https://example.com';
    const encodedUrl = btoa(encodeURIComponent(testUrl));

    render(
      <RestClientContext.Provider value={{ setErrorInput: mockSetErrorInput }}>
        <InputUrl url={encodedUrl} />
      </RestClientContext.Provider>
    );

    expect(mockSetErrorInput).toHaveBeenCalledWith(false);
  });
});
