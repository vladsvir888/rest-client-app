import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Body } from './Body';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { validation } from '@/lib/validation';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/lib/validation', () => ({
  validation: vi.fn(),
}));

const mockLocation = {
  href: 'http://localhost/rest-client/select/url/body?Content-Type=application%2Fjson',
};
vi.stubGlobal('location', mockLocation);
vi.stubGlobal('history', {
  replaceState: vi.fn(),
});
vi.stubGlobal('localStorage', {
  getItem: vi.fn().mockReturnValue('{ "фыв": "{{BAR}}" }'),
});

vi.mock('antd', () => ({
  Input: {
    TextArea: vi.fn(({ value, onChange, status, style, rows }) => (
      <textarea
        value={value}
        onChange={onChange}
        data-status={status}
        style={style}
        rows={rows}
        data-testid="body-textarea"
      />
    )),
  },
  Select: vi.fn(({ value, onChange, options, className }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      data-testid="body-select"
    >
      {options.map((opt: { value: string; label: string }) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )),
  Typography: {
    Text: vi.fn(({ children, type }) => (
      <span data-type={type} data-testid="error-text">
        {children}
      </span>
    )),
  },
}));

const mockSetErrorBody = vi.fn();
let mockSearchParams;
let mockTranslations;

beforeEach(() => {
  vi.clearAllMocks();

  mockSearchParams = new URLSearchParams();
  vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as never);

  mockTranslations = vi.fn((key) => key);
  vi.mocked(useTranslations).mockReturnValue(mockTranslations as never);

  vi.mocked(validation).mockReturnValue({ res: '', error: false, origin: '' });
});

afterEach(() => {
  vi.clearAllTimers();
});

describe('Body Component', () => {
  it('render', () => {
    render(
      <RestClientContext.Provider value={{ setErrorBody: mockSetErrorBody }}>
        <Body body="" />
      </RestClientContext.Provider>
    );

    expect(screen.getByTestId('body-select')).toHaveValue('none');
    expect(screen.queryByTestId('body-textarea')).not.toBeInTheDocument();
    expect(screen.getByTestId('error-text')).toHaveTextContent('');
  });

  it('render textarea', () => {
    mockSearchParams = new URLSearchParams('Content-Type=application%2Fjson');
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as never);
    const validJson = '{"key": "value"}';
    const encodedBody = btoa(encodeURIComponent(validJson));

    render(
      <RestClientContext.Provider value={{ setErrorBody: mockSetErrorBody }}>
        <Body body={encodedBody} />
      </RestClientContext.Provider>
    );

    expect(screen.getByTestId('body-select')).toHaveValue('json');
    expect(screen.getByTestId('body-textarea')).toHaveValue(
      JSON.stringify(JSON.parse(validJson), null, 4)
    );
    expect(screen.getByTestId('error-text')).toHaveTextContent('');
  });

  it('update URL', async () => {
    render(
      <RestClientContext.Provider value={{ setErrorBody: mockSetErrorBody }}>
        <Body body="" />
      </RestClientContext.Provider>
    );

    fireEvent.change(screen.getByTestId('body-select'), { target: { value: 'json' } });

    expect(screen.getByTestId('body-select')).toHaveValue('json');
    expect(screen.getByTestId('body-textarea')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        expect.stringContaining('Content-Type=application%2Fjson')
      );
    });
  });

  it('clear textarea', async () => {
    mockSearchParams = new URLSearchParams('Content-Type=application%2Fjson');
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as never);

    render(
      <RestClientContext.Provider value={{ setErrorBody: mockSetErrorBody }}>
        <Body body={btoa(encodeURIComponent('{"key": "value"}'))} />
      </RestClientContext.Provider>
    );

    fireEvent.change(screen.getByTestId('body-select'), { target: { value: 'none' } });

    expect(screen.getByTestId('body-select')).toHaveValue('none');
    expect(screen.queryByTestId('body-textarea')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        expect.not.stringContaining('Content-Type')
      );
    });
  });

  it('display JSON', async () => {
    mockSearchParams = new URLSearchParams('Content-Type=application%2Fjson');
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as never);
    vi.mocked(validation).mockReturnValue({
      type: 'json',
      error: true,
      res: 'Invalid JSON',
      origin: '',
    });

    render(
      <RestClientContext.Provider value={{ setErrorBody: mockSetErrorBody }}>
        <Body body={btoa(encodeURIComponent('invalid'))} />
      </RestClientContext.Provider>
    );

    expect(screen.getByTestId('error-text')).toHaveTextContent('');
  });

  it('update URL with debounced', async () => {
    mockSearchParams = new URLSearchParams('Content-Type=application%2Fjson');
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as never);

    render(
      <RestClientContext.Provider value={{ setErrorBody: mockSetErrorBody }}>
        <Body body="" />
      </RestClientContext.Provider>
    );

    const textarea = screen.getByTestId('body-textarea');
    fireEvent.change(textarea, { target: { value: '{"new": "data"}' } });

    expect(textarea).toHaveValue('{"new": "data"}');
  });
});
