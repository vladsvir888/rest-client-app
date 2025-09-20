import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignInPage from './page';

vi.mock('@/app/actions/auth', () => ({
  checkAuth: vi.fn(),
}));

vi.mock('@/components/auth/AuthRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-route">{children}</div>
  ),
}));

vi.mock('@/components/auth/AuthForm', () => ({
  default: ({ type }: { type: string }) => <form data-testid="auth-form">{type}</form>,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SignIn', () => {
  it('render', () => {
    render(<SignInPage />);
    expect(screen.getByTestId('auth-route')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toHaveTextContent('login');
  });
});
