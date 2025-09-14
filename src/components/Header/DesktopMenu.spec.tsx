import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesktopMenu } from './DesktopMenu';
import { MenuProps } from 'antd';

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Menu: ({
      items,
      selectedKeys,
      onClick,
      style,
      theme,
      mode,
    }: {
      items: Array<{ key: string; label: string }>;
      selectedKeys: string[];
      onClick: MenuProps['onClick'];
      style: React.CSSProperties;
      theme: string;
      mode: string;
    }) => (
      <div
        data-testid="menu"
        style={style}
        data-theme={theme}
        data-mode={mode}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const key = target.dataset?.key;
          if (key && onClick) {
            onClick({ key } as Parameters<NonNullable<MenuProps['onClick']>>[0]);
          }
        }}
      >
        {items.map((item) => (
          <div key={item.key} data-key={item.key} data-selected={selectedKeys.includes(item.key)}>
            {item.label}
          </div>
        ))}
      </div>
    ),
    Button: ({
      children,
      type,
      style,
    }: {
      children: React.ReactNode;
      type?: string;
      style?: React.CSSProperties;
    }) => (
      <button style={style} data-type={type}>
        {children}
      </button>
    ),
  };
});

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => `Translated_${key}`),
}));

vi.mock('../CustomLink/CustomLink', () => ({
  CustomLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('../auth/LogOutButton', () => ({
  default: () => <button data-testid="logout-button">Log Out</button>,
}));

const defaultProps = {
  current: 'history',
  onClick: vi.fn(),
  user: false,
};

describe('DesktopMenu', () => {
  it('render user false', () => {
    render(<DesktopMenu {...defaultProps} />);

    const signInButton = screen.getByText('Translated_sign_in');
    expect(signInButton).toBeInTheDocument();
    expect(signInButton.closest('button')).toHaveAttribute('data-type', 'primary');
    expect(signInButton.closest('a')).toHaveAttribute('href', '/sign-in');

    const signUpButton = screen.getByText('Translated_sign_up');
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton.closest('button')).not.toHaveAttribute('data-type', 'primary');
    expect(signUpButton.closest('a')).toHaveAttribute('href', '/sign-up');

    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

  it('render user true', () => {
    render(<DesktopMenu {...defaultProps} user={true} />);

    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveStyle({
      flex: '1 1 0%',
    });
    expect(menu).toHaveAttribute('data-theme', 'dark');
    expect(menu).toHaveAttribute('data-mode', 'horizontal');

    const navItems = [
      { key: 'history', label: 'Translated_history', href: '/history' },
      { key: 'rest-client', label: 'Translated_restful', href: '/rest-client' },
      { key: 'variables', label: 'Translated_variables', href: '/variables' },
    ];

    navItems.forEach((item) => {
      const navItem = screen.getByText(item.label);
      expect(navItem).toBeInTheDocument();
      expect(navItem.closest('a')).toHaveAttribute('href', item.href);
      expect(navItem.closest('div')).toHaveAttribute('data-key', item.key);
      expect(navItem.closest('div')).toHaveAttribute(
        'data-selected',
        item.key === defaultProps.current ? 'true' : 'false'
      );
    });

    const logoutButton = screen.getByTestId('logout-button');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent('Log Out');

    expect(screen.queryByText('Translated_sign_in')).not.toBeInTheDocument();
    expect(screen.queryByText('Translated_sign_up')).not.toBeInTheDocument();
  });

  it('call onClick', () => {
    const onClick = vi.fn();
    render(<DesktopMenu {...defaultProps} user={true} onClick={onClick} />);

    const historyItem = screen.getByText('Translated_history').closest('div');
    historyItem?.click();
    expect(onClick).toHaveBeenCalledWith({ key: 'history' });
  });

  it('style', () => {
    render(<DesktopMenu {...defaultProps} user={false} />);

    const container = screen.getByText('Translated_sign_in').closest('div')?.parentElement;
    expect(container).toHaveStyle({ display: 'flex', alignItems: 'center', flexGrow: 1 });

    const buttonsContainer = screen.getByText('Translated_sign_up').closest('div');
    expect(buttonsContainer).toHaveStyle({ marginLeft: 'auto' });

    const signInButton = screen.getByText('Translated_sign_in').closest('button');
    expect(signInButton).toHaveStyle({ marginRight: '10px' });
  });

  it('translate', () => {
    render(<DesktopMenu {...defaultProps} user={true} />);

    expect(screen.getByText('Translated_history')).toBeInTheDocument();
    expect(screen.getByText('Translated_restful')).toBeInTheDocument();
    expect(screen.getByText('Translated_variables')).toBeInTheDocument();

    render(<DesktopMenu {...defaultProps} user={false} />);
    expect(screen.getByText('Translated_sign_in')).toBeInTheDocument();
    expect(screen.getByText('Translated_sign_up')).toBeInTheDocument();
  });
});
