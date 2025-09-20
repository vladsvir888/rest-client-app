import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Layout: {
      Footer: ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>,
    },
    Typography: {
      Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
      Link: ({
        children,
        href,
        target,
        rel,
      }: {
        children: React.ReactNode;
        href: string;
        target?: string;
        rel?: string;
      }) => (
        <a href={href} target={target} rel={rel}>
          {children}
        </a>
      ),
    },
    Space: ({ children, size }: { children: React.ReactNode; size?: string }) => (
      <div style={{ display: 'flex', gap: size === 'small' ? '8px' : '16px' }}>{children}</div>
    ),
  };
});

vi.mock('@ant-design/icons', () => ({
  GithubOutlined: () => <span data-testid="github-icon">GitHub Icon</span>,
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    target,
    rel,
  }: {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
  }) => (
    <a href={href} target={target} rel={rel}>
      {children}
    </a>
  ),
}));

describe('Footer', () => {
  it('render', () => {
    render(<Footer />);

    const authors = [
      { name: 'Vladislav Svirydovich', link: 'https://github.com/vladsvir888' },
      { name: 'Uladzimir Hancharou', link: 'https://github.com/totoogg' },
      { name: 'Ivan Antonov', link: 'https://github.com/ivan1antonov' },
    ];

    authors.forEach((author) => {
      const linkElement = screen.getByText(author.name);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', author.link);
      expect(linkElement.closest('a')).toHaveAttribute('target', '_blank');
      expect(linkElement.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');

      const githubIcon = screen
        .getAllByTestId('github-icon')
        .find((icon) => icon.parentElement?.textContent?.includes(author.name));
      expect(githubIcon).toBeInTheDocument();
    });
  });

  it('render RS School', () => {
    render(<Footer />);

    const rsSchoolLink = screen.getByText('RS School React Course');
    expect(rsSchoolLink).toBeInTheDocument();
    expect(rsSchoolLink.closest('a')).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(rsSchoolLink.closest('a')).toHaveAttribute('target', '_blank');
    expect(rsSchoolLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');

    const rsSchoolLogo = screen.getByAltText('RS School Logo');
    expect(rsSchoolLogo).toBeInTheDocument();
    expect(rsSchoolLogo).toHaveAttribute('src', 'rss.svg');
    expect(rsSchoolLogo).toHaveAttribute('width', '24');
    expect(rsSchoolLogo).toHaveAttribute('height', '24');
  });

  it('render RS School link', () => {
    render(<Footer />);

    const rsSchoolLink = screen.getByText('RS School React Course');
    const rsSchoolLogo = screen.getByAltText('RS School Logo');
    const spaceContainer = rsSchoolLink.closest('div');
    expect(spaceContainer).toContainElement(rsSchoolLogo);
    expect(spaceContainer).toHaveStyle({ display: 'flex', gap: '8px' });
  });
});
