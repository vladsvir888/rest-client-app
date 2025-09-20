import { render, screen } from '@testing-library/react';
import { UrlLine } from './UrlLine';
import { vi, describe, it, expect } from 'vitest';

vi.mock('./InputUrl', () => ({
  InputUrl: ({ url }: { url: string }) => <div data-testid="input-url">InputUrl: {url}</div>,
}));

vi.mock('./Search', () => ({
  Search: () => <div data-testid="search">Search</div>,
}));

vi.mock('./SelectClient', () => ({
  SelectClient: ({ select }: { select: string }) => (
    <div data-testid="select-client">Select: {select}</div>
  ),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'restClient.title': 'Client',
    };
    return translations[key];
  },
}));

vi.mock('./UrlLine.module.css', () => ({
  default: {
    wrapper: 'wrapper-mocked',
  },
}));

describe('UrlLine', () => {
  it('render', () => {
    const testProps = {
      select: 'POST',
      url: 'https://example.com/api',
    };

    render(<UrlLine {...testProps} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('REST');

    expect(screen.getByTestId('select-client')).toHaveTextContent('Select: POST');
    expect(screen.getByTestId('input-url')).toHaveTextContent('InputUrl: https://example.com/api');
    expect(screen.getByTestId('search')).toBeInTheDocument();

    const wrapper = screen.getByTestId('select-client').parentElement;
    expect(wrapper).toHaveClass('wrapper-mocked');
  });

  it('render different props', () => {
    const testProps = {
      select: 'GET',
      url: 'https://api.example.com/users',
    };

    render(<UrlLine {...testProps} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('RES');

    expect(screen.getByTestId('select-client')).toHaveTextContent('Select: GET');
    expect(screen.getByTestId('input-url')).toHaveTextContent(
      'InputUrl: https://api.example.com/users'
    );
  });
});
