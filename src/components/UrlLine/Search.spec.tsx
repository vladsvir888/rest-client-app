import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Search } from './Search';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { sendRequest } from '@/app/api/sendRequest';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { act } from 'react';

vi.mock('@/app/actions/history.ts', () => ({
  addHistory: vi.fn(),
}));

vi.mock('@/app/api/sendRequest');
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
      send: 'Send',
      serverError: 'Server Error',
      requestError: 'Request Error',
      networkError: 'Network Error',
    };
    return translations[key];
  },
}));

vi.mock('../Loader/Loader', () => ({
  Loader: () => (
    <div role="status" data-testid="loader">
      Loading...
    </div>
  ),
}));

const mockSetResponse = vi.fn();
const mockSendRequest = sendRequest as Mock;
const mockUsePathname = usePathname as Mock;
const mockUseSearchParams = useSearchParams as Mock;

beforeEach(() => {
  vi.clearAllMocks();
  mockUsePathname.mockReturnValue('/POST/dGVzdC11cmw=/');
  mockUseSearchParams.mockReturnValue(new URLSearchParams());
});

describe('Search', () => {
  it('render', () => {
    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: false,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('enable button', () => {
    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: false,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    const button = screen.getByText('Send');
    expect(button).not.toHaveClass('button-disable');
  });

  it('show loader', async () => {
    mockSendRequest.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ res: 'test response' }), 100);
        })
    );

    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: false,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    const button = screen.getByText('Send');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  it('translate', async () => {
    mockSendRequest.mockResolvedValue({ res: 'Server error' });

    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: false,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    const button = screen.getByText('Send');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSetResponse).toHaveBeenCalledWith({ res: 'Server Error' });
    });
  });

  it('translate invalid', async () => {
    mockSendRequest.mockResolvedValue({ res: 'Invalid request' });

    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: false,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    const button = screen.getByText('Send');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSetResponse).toHaveBeenCalledWith({ res: 'Request Error' });
    });
  });

  it('translate network', async () => {
    mockSendRequest.mockResolvedValue({ res: 'Network error. Could not send request' });

    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: false,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    const button = screen.getByText('Send');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSetResponse).toHaveBeenCalledWith({ res: 'Network Error' });
    });
  });

  it('not send request', () => {
    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: true,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    const button = screen.getByText('Send');
    fireEvent.click(button);

    expect(mockSendRequest).not.toHaveBeenCalled();
  });

  it('parse query parameters', async () => {
    mockSendRequest.mockResolvedValue({ res: 'test response' });
    const searchParams = new URLSearchParams();
    searchParams.append('Content-Type', 'application/json');
    searchParams.append('Authorization', 'Bearer token');
    mockUseSearchParams.mockReturnValue(searchParams);

    render(
      <RestClientContext.Provider
        value={{
          setResponse: mockSetResponse,
          errorBody: false,
          errorHeader: false,
          errorInput: false,
        }}
      >
        <Search />
      </RestClientContext.Provider>
    );

    const button = screen.getByText('Send');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalled();
      const headers = mockSendRequest.mock.calls[0][3] as Headers;
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Authorization')).toBe('Bearer token');
    });
  });
});
