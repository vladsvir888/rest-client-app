import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import * as antd from 'antd';
import { usePathname } from '@/i18n/navigation';

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Layout: {
      Header: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
        <header style={style} data-testid="header">
          {children}
        </header>
      ),
    },
    Typography: {
      Title: ({
        level,
        children,
        style,
      }: {
        level: number;
        children: React.ReactNode;
        style?: React.CSSProperties;
      }) => (
        <h3 style={style} data-level={level}>
          {children}
        </h3>
      ),
    },
    Grid: {
      useBreakpoint: vi.fn(() => ({ md: true })),
    },
  };
});

vi.mock('@ant-design/icons', () => ({
  AntCloudOutlined: () => <span data-testid="cloud-icon">Cloud Icon</span>,
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: vi.fn(() => '/history'),
}));

vi.mock('./DesktopMenu', () => ({
  DesktopMenu: ({
    user,
    current,
  }: {
    user: boolean;
    current: string;
    onClick?: (e: { key: string }) => void;
  }) => (
    <div data-testid="desktop-menu" data-user={user} data-current={current}>
      Desktop Menu
    </div>
  ),
}));

vi.mock('./MobileMenu', () => ({
  MobileMenu: ({
    user,
    current,
  }: {
    user: boolean;
    current: string;
    onClick?: (e: { key: string }) => void;
  }) => (
    <div data-testid="mobile-menu" data-user={user} data-current={current}>
      Mobile Menu
    </div>
  ),
}));

vi.mock('../LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

vi.mock('../CustomLink/CustomLink', () => ({
  CustomLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="custom-link">
      {children}
    </a>
  ),
}));

const defaultProps = {
  user: false,
};

beforeEach(() => {
  vi.mocked(antd.Grid.useBreakpoint).mockReturnValue({ md: true });
  vi.mocked(usePathname).mockReturnValue('/history');
  vi.spyOn(window, 'addEventListener');
  vi.spyOn(window, 'removeEventListener');
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Header', () => {
  it('render', () => {
    render(<Header {...defaultProps} />);

    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveStyle({
      paddingLeft: 10,
      paddingRight: 10,
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '74px',
    });

    const title = screen.getByTestId('custom-link');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('href', '/');
    expect(screen.getByTestId('cloud-icon')).toBeInTheDocument();
    expect(title.closest('h3')).toHaveAttribute('data-level', '3');
    expect(title.closest('h3')).toHaveStyle({ color: '#1890ff', alignItems: 'center', margin: 0 });

    const desktopMenu = screen.getByTestId('desktop-menu');
    expect(desktopMenu).toBeInTheDocument();
    expect(desktopMenu).toHaveAttribute('data-user', 'false');
    expect(desktopMenu).toHaveAttribute('data-current', 'history');

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();

    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('render MobileMenu', () => {
    vi.mocked(antd.Grid.useBreakpoint).mockReturnValue({ md: false });

    render(<Header {...defaultProps} />);

    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).toHaveAttribute('data-user', 'false');
    expect(mobileMenu).toHaveAttribute('data-current', 'history');

    expect(screen.queryByTestId('desktop-menu')).not.toBeInTheDocument();

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
  });

  it('remove unmount', () => {
    const { unmount } = render(<Header {...defaultProps} />);

    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });

    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('menu item', () => {
    vi.mocked(usePathname).mockReturnValue('/rest-client');
    render(<Header {...defaultProps} />);

    const desktopMenu = screen.getByTestId('desktop-menu');
    expect(desktopMenu).toHaveAttribute('data-current', 'rest-client');
  });

  it('call handleMenuClick', async () => {
    render(<Header {...defaultProps} />);

    const desktopMenu = screen.getByTestId('desktop-menu');
    fireEvent.click(desktopMenu);

    expect(desktopMenu).toHaveAttribute('data-current', 'history');
    desktopMenu.dispatchEvent(new Event('click', { bubbles: true }));
  });
});
