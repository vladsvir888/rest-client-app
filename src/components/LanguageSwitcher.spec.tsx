import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from './LanguageSwitcher';
import * as nextNavigation from 'next/navigation';
import { useLocale } from 'next-intl';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface MockRouter extends Partial<AppRouterInstance> {
  push: ReturnType<typeof vi.fn>;
}

interface MockSearchParams {
  toString(): string;
}

interface SelectOption {
  value: string;
  label: string;
}

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useLocale: vi.fn(),
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Select: ({
      value,
      onChange,
      options,
      style,
    }: {
      value: string;
      onChange: (value: string) => void;
      options: SelectOption[];
      style?: React.CSSProperties;
    }) => (
      <select
        data-testid="language-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  };
});

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'fr', 'es'],
  },
}));

const mockRouter: MockRouter = { push: vi.fn() };
const mockSearchParams: MockSearchParams = { toString: () => '' };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(nextNavigation.useRouter).mockReturnValue(mockRouter as AppRouterInstance);
  vi.mocked(nextNavigation.usePathname).mockReturnValue('/en/home');
  vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
    mockSearchParams as unknown as ReturnType<typeof nextNavigation.useSearchParams>
  );
  vi.mocked(useLocale).mockReturnValue('en');
});

describe('LanguageSwitcher', () => {
  it('render', () => {
    render(<LanguageSwitcher />);

    const select = screen.getByTestId('language-select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('en');
    expect(select).toHaveStyle({ marginLeft: 20 });

    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('fr')).toBeInTheDocument();
    expect(screen.getByText('es')).toBeInTheDocument();
  });

  it('update', async () => {
    render(<LanguageSwitcher />);

    const select = screen.getByTestId('language-select');
    fireEvent.change(select, { target: { value: 'fr' } });

    expect(select).toHaveValue('fr');
    expect(mockRouter.push).toHaveBeenCalledWith('/fr/home');
  });

  it('search params', async () => {
    const mockSearchParamsWithValue: MockSearchParams = { toString: () => 'key=value' };
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      mockSearchParamsWithValue as unknown as ReturnType<typeof nextNavigation.useSearchParams>
    );

    render(<LanguageSwitcher />);

    const select = screen.getByTestId('language-select');
    fireEvent.change(select, { target: { value: 'es' } });

    expect(mockRouter.push).toHaveBeenCalledWith('/es/home?key=value');
  });

  it('replace', async () => {
    vi.mocked(nextNavigation.usePathname).mockReturnValue('/en/about/page');

    render(<LanguageSwitcher />);

    const select = screen.getByTestId('language-select');
    fireEvent.change(select, { target: { value: 'fr' } });

    expect(mockRouter.push).toHaveBeenCalledWith('/fr/about/page');
  });

  it('initialize', () => {
    vi.mocked(useLocale).mockReturnValue('es');

    render(<LanguageSwitcher />);

    const select = screen.getByTestId('language-select');
    expect(select).toHaveValue('es');
  });

  it('empty', async () => {
    const emptyMockSearchParams: MockSearchParams = { toString: () => '' };
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      emptyMockSearchParams as unknown as ReturnType<typeof nextNavigation.useSearchParams>
    );

    render(<LanguageSwitcher />);

    const select = screen.getByTestId('language-select');
    fireEvent.change(select, { target: { value: 'fr' } });

    expect(mockRouter.push).toHaveBeenCalledWith('/fr/home');
  });

  it('pathname', async () => {
    vi.mocked(nextNavigation.usePathname).mockReturnValue('/en');

    render(<LanguageSwitcher />);

    const select = screen.getByTestId('language-select');
    fireEvent.change(select, { target: { value: 'fr' } });

    expect(mockRouter.push).toHaveBeenCalledWith('/fr');
  });
});
