import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Variables from './Variables';
import { checkAuth } from '@/app/actions/auth';

vi.mock('@/app/actions/auth', () => ({
  checkAuth: vi.fn(),
}));

vi.mock('../auth/AuthRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-route">{children}</div>
  ),
}));

vi.mock('../VariableTitle', () => ({
  default: () => <h1 data-testid="variable-title">Variable Title</h1>,
}));

vi.mock('../VariableInfo', () => ({
  default: ({ authUser }: { authUser: string }) => (
    <div data-testid="variable-info" data-auth-user={authUser}>
      Variable Info
    </div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(checkAuth).mockResolvedValue({ authenticated: true, userEmail: 'test@example.com' });
});

describe('Variables', () => {
  it('render', async () => {
    const renderResult = render(await Variables());

    const authRoute = screen.getByTestId('auth-route');
    expect(authRoute).toBeInTheDocument();

    const containerElement = renderResult.container.querySelector('.container');
    expect(containerElement).toBeInTheDocument();
    expect(containerElement?.firstChild).toHaveClass('private-layout');

    expect(screen.getByTestId('variable-title')).toBeInTheDocument();
    expect(screen.getByTestId('variable-title')).toHaveTextContent('Variable Title');

    const variableInfo = screen.getByTestId('variable-info');
    expect(variableInfo).toBeInTheDocument();
    expect(variableInfo).toHaveAttribute('data-auth-user', 'test@example.com');

    expect(checkAuth).toHaveBeenCalledTimes(1);
  });

  it('handle checkAuth', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ authenticated: true, userEmail: undefined });

    const renderResult = render(await Variables());

    expect(screen.getByTestId('auth-route')).toBeInTheDocument();
    expect(screen.getByTestId('variable-title')).toBeInTheDocument();
    expect(renderResult.container.querySelector('.container')).toBeInTheDocument();
    expect(renderResult.container.querySelector('.private-layout')).toBeInTheDocument();
  });

  it('call checkAuth', async () => {
    await render(await Variables());

    expect(checkAuth).toHaveBeenCalledTimes(1);
  });

  it('render checkAuth rejects', async () => {
    vi.mocked(checkAuth).mockRejectedValue(new Error('Auth error'));

    await expect(Variables()).rejects.toThrow('Auth error');
  });
});
