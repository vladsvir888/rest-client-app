import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthPanel from './AuthPanel';
import { checkAuth } from '@/app/actions/auth';

vi.mock('@/app/actions/auth', () => ({
  checkAuth: vi.fn(),
}));

vi.mock('./LogOutButton', () => ({
  default: () => <button data-testid="logout-btn">Log Out</button>,
}));

vi.mock('../text-link/TextLink', () => ({
  default: ({ href, textKey }: { href: string; textKey: string }) => (
    <a data-testid={`text-link-${textKey}`} href={href}>
      {textKey}
    </a>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthPanel', () => {
  it('renders LogOutButton when authenticated', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ authenticated: true });

    render(await AuthPanel());

    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
    expect(screen.getByTestId('logout-btn').textContent).toBe('Log Out');
    expect(checkAuth).toHaveBeenCalledTimes(1);
  });

  it('renders sign-in and sign-up links when not authenticated', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ authenticated: false });

    render(await AuthPanel());

    expect(screen.getByTestId('text-link-sign_in')).toBeInTheDocument();
    expect(screen.getByTestId('text-link-sign_up')).toBeInTheDocument();
    expect(screen.getByTestId('text-link-sign_in').getAttribute('href')).toBe('/sign-in');
    expect(screen.getByTestId('text-link-sign_up').getAttribute('href')).toBe('/sign-up');
    expect(checkAuth).toHaveBeenCalledTimes(1);
  });

  it('calls checkAuth once', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ authenticated: false });

    render(await AuthPanel());

    expect(checkAuth).toHaveBeenCalledTimes(1);
  });

  it('throws error if checkAuth rejects', async () => {
    vi.mocked(checkAuth).mockRejectedValue(new Error('Auth error'));

    await expect(AuthPanel()).rejects.toThrow('Auth error');
  });
});
