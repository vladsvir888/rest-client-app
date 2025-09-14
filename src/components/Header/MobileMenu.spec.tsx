import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MobileMenu } from './MobileMenu';
import { MenuProps } from 'antd';

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Drawer: ({
      title,
      placement,
      onClose,
      open,
      width,
      children,
    }: {
      title: string;
      placement: string;
      onClose: () => void;
      open: boolean;
      width: string;
      children: React.ReactNode;
    }) => (
      <div
        data-testid="drawer"
        data-title={title}
        data-placement={placement}
        data-open={open}
        style={{ width }}
        onClick={onClose}
      >
        {children}
      </div>
    ),
    Menu: ({
      items,
      selectedKeys,
      onClick,
      mode,
    }: {
      items: Array<{ key: string; label: string }>;
      selectedKeys: string[];
      onClick: MenuProps['onClick'];
      mode: string;
    }) => (
      <div
        data-testid="menu"
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
      icon,
      onClick,
      size,
    }: {
      children?: React.ReactNode;
      type?: string;
      style?: React.CSSProperties;
      icon?: React.ReactNode;
      onClick?: () => void;
      size?: string;
    }) => (
      <button
        data-type={type}
        style={style}
        onClick={onClick}
        data-size={size}
        data-testid={icon ? 'menu-button' : undefined}
      >
        {icon}
        {children}
      </button>
    ),
    Space: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className} style={{ display: 'flex', gap: '8px' }}>
        {children}
      </div>
    ),
    Grid: {
      useBreakpoint: () => ({ xs: true }),
    },
  };
});

vi.mock('@ant-design/icons', () => ({
  MenuOutlined: () => <span data-testid="menu-icon">Menu Icon</span>,
}));

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

describe('MobileMenu', () => {
  it('render user false', async () => {
    render(<MobileMenu {...defaultProps} />);

    const signInButton = screen.getByText('Translated_sign_in');
    expect(signInButton).toBeInTheDocument();
    expect(signInButton.closest('button')).toHaveAttribute('data-type', 'primary');
    expect(signInButton.closest('button')).toHaveStyle({ marginRight: '10px' });
    expect(signInButton.closest('a')).toHaveAttribute('href', '/sign-in');

    const signUpButton = screen.getByText('Translated_sign_up');
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton.closest('button')).not.toHaveAttribute('data-type', 'primary');
    expect(signUpButton.closest('a')).toHaveAttribute('href', '/sign-up');

    expect(screen.queryByTestId('menu-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

  it('render button user true', async () => {
    render(<MobileMenu {...defaultProps} user={true} />);

    const menuButton = screen.getByTestId('menu-button');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('data-size', 'small');
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();

    const logoutButton = screen.getByTestId('logout-button');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent('Log Out');

    expect(screen.queryByText('Translated_sign_in')).not.toBeInTheDocument();
    expect(screen.queryByText('Translated_sign_up')).not.toBeInTheDocument();
  });

  it('open drawer', async () => {
    render(<MobileMenu {...defaultProps} user={true} />);

    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute('data-title', 'Меню');
    expect(drawer).toHaveAttribute('data-placement', 'right');
    expect(drawer).toHaveAttribute('data-open', 'true');
    expect(drawer).toHaveStyle({ width: '80%' });

    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute('data-mode', 'vertical');

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
  });

  it('close drawer', async () => {
    const onClick = vi.fn();
    render(<MobileMenu {...defaultProps} user={true} onClick={onClick} />);

    fireEvent.click(screen.getByTestId('menu-button'));

    const historyItem = screen.getByText('Translated_history').closest('div');
    fireEvent.click(historyItem!);

    expect(onClick).toHaveBeenCalledWith({ key: 'history' });
  });

  it('close drawer onClose', async () => {
    render(<MobileMenu {...defaultProps} user={true} />);

    fireEvent.click(screen.getByTestId('menu-button'));
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
  });

  it('style', async () => {
    render(<MobileMenu {...defaultProps} user={false} />);

    const spaceContainer = screen.getByText('Translated_sign_in').closest('div');
    expect(spaceContainer).toHaveStyle({ display: 'flex', gap: '8px' });

    const signInButton = screen.getByText('Translated_sign_in').closest('button');
    expect(signInButton).toHaveStyle({ marginRight: '10px' });
  });

  it('translate', async () => {
    render(<MobileMenu {...defaultProps} user={true} />);

    fireEvent.click(screen.getByTestId('menu-button'));

    expect(screen.getByText('Translated_history')).toBeInTheDocument();
    expect(screen.getByText('Translated_restful')).toBeInTheDocument();
    expect(screen.getByText('Translated_variables')).toBeInTheDocument();

    render(<MobileMenu {...defaultProps} user={false} />);
    expect(screen.getByText('Translated_sign_in')).toBeInTheDocument();
    expect(screen.getByText('Translated_sign_up')).toBeInTheDocument();
  });

  it('drawer width', async () => {
    render(<MobileMenu {...defaultProps} user={true} />);

    fireEvent.click(screen.getByTestId('menu-button'));

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveStyle({ width: '80%' });
  });
});
