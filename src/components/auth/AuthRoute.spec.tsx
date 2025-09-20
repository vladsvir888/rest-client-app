import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import AuthRoute from './AuthRoute';
import { checkAuth } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const mockHeaders = headers as Mock;

vi.mock('@/app/actions/auth', () => ({
  checkAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthRoute', () => {
  it('redirects unauthenticated user from private route', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ authenticated: false });

    const headersInstance = new Headers();
    headersInstance.set('link', '<https://example.com/en/rest-client>; rel="canonical"');
    mockHeaders.mockResolvedValue(headersInstance);

    await AuthRoute({ children: <div>Private</div> });
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('renders children if authenticated and not on auth route', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ authenticated: true });

    const headersInstance = new Headers();
    headersInstance.set('link', '<https://example.com/en/rest-client>; rel="canonical"');
    mockHeaders.mockResolvedValue(headersInstance);

    const result = await AuthRoute({ children: <div data-testid="child">Child</div> });
    expect(result.props.children.props['data-testid']).toBe('child');
  });
});
