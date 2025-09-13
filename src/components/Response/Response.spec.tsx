import { render, screen } from '@testing-library/react';
import { Response } from './Response';
import { RestClientContext } from '../RestClientProvider/RestClientProvider';
import { vi, describe, it, expect } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'restClient.response': 'Response',
      'restClient.status': 'Status',
    };
    return translations[key];
  },
}));

describe('Response', () => {
  it('render', () => {
    const mockContextValue = {
      response: { status: -1, res: '' },
    };

    render(
      <RestClientContext.Provider value={mockContextValue}>
        <Response />
      </RestClientContext.Provider>
    );

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('render success response', () => {
    const mockContextValue = {
      response: { status: 200, res: '{"message": "Success"}' },
    };

    render(
      <RestClientContext.Provider value={mockContextValue}>
        <Response />
      </RestClientContext.Provider>
    );

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('200')).toHaveClass('ant-typography-success');
    expect(screen.getByRole('textbox')).toHaveValue('{"message": "Success"}');
  });

  it('render error response', () => {
    const mockContextValue = {
      response: { status: 404, res: 'Not Found' },
    };

    render(
      <RestClientContext.Provider value={mockContextValue}>
        <Response />
      </RestClientContext.Provider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('404')).toHaveClass('ant-typography-danger');
    expect(screen.getByRole('textbox')).toHaveValue('Not Found');
  });

  it('render server error response', () => {
    const mockContextValue = {
      response: { status: 500, res: 'Internal Server Error' },
    };

    render(
      <RestClientContext.Provider value={mockContextValue}>
        <Response />
      </RestClientContext.Provider>
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('500')).toHaveClass('ant-typography-danger');
    expect(screen.getByRole('textbox')).toHaveValue('Internal Server Error');
  });

  it('render textarea', () => {
    const mockContextValue = {
      response: { status: 200, res: 'Success' },
    };

    render(
      <RestClientContext.Provider value={mockContextValue}>
        <Response />
      </RestClientContext.Provider>
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readonly');
  });
});
