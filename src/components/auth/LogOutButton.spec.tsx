import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LogOutButton from './LogOutButton';
import { logout } from '@/app/actions/auth';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/app/actions/auth', () => ({
  logout: vi.fn(),
}));

const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LogOutButton', () => {
  it('renders button with sign_out text', () => {
    render(<LogOutButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('sign_out');
  });

  it('calls logout and router.refresh on click', async () => {
    const mockLogout = vi.mocked(logout);
    mockLogout.mockResolvedValue(undefined);

    render(<LogOutButton />);
    const button = screen.getByRole('button');
    await fireEvent.click(button);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
