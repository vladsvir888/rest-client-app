import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, vi, beforeEach, it } from 'vitest';
import History from './History';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { THistory } from '@/types/types';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const tMock = vi.fn((key) => {
  if (key === 'history_requests') return 'History Requests';
  return key;
});
vi.mock('next-intl', () => ({
  useTranslations: () => tMock,
}));

const historyData: THistory[] = [
  {
    requestDuration: 179,
    responseStatusCode: 200,
    requestTimestamp: Date.now(),
    requestMethod: 'GET',
    requestSize: 0,
    responseSize: 292,
    errorDetails: '',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    path: '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/',
    answer: {
      status: 200,
      res: '',
    },
  },
];

global.getComputedStyle = vi.fn().mockReturnValue({});

describe('History', () => {
  beforeEach(() => {
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
    vi.clearAllMocks();
  });

  it('renders empty state when history is empty', () => {
    render(<History history={[]} />);
    expect(
      screen.getByText(`You haven't executed any requests yet. It's empty here. Try:`)
    ).toBeInTheDocument();
    expect(screen.getByText('restful')).toBeInTheDocument();
  });

  it('renders table and title when history has data', () => {
    render(<History history={historyData} />);
    expect(screen.getByText('History Requests')).toBeInTheDocument();
    expect(screen.getByText(historyData[0].url)).toBeInTheDocument();
    expect(screen.getByText(historyData[0].path)).toBeInTheDocument();
    expect(screen.getByText(historyData[0].requestMethod)).toBeInTheDocument();
  });

  it('clicking path button calls setResponse and router.push', () => {
    const setResponseMock = vi.fn();
    render(
      <RestClientContext.Provider value={{ setResponse: setResponseMock }}>
        <History history={historyData} />
      </RestClientContext.Provider>
    );
    const pathButton = screen.getByText(historyData[0].path);
    fireEvent.click(pathButton);
    expect(setResponseMock).toHaveBeenCalledWith(historyData[0].answer);
    expect(pushMock).toHaveBeenCalledWith(historyData[0].path);
  });
});
