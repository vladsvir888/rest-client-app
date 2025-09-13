import { render, screen, fireEvent } from '@testing-library/react';
import { SelectClient } from './SelectClient';
import { usePathname, useSearchParams } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/consts/rest-client', () => ({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

vi.mock('./UrlLine.module.css', () => ({
  default: {
    select: 'select-mocked',
  },
}));

const mockUsePathname = usePathname as Mock;
const mockUseSearchParams = useSearchParams as Mock;

beforeEach(() => {
  vi.clearAllMocks();
  mockUsePathname.mockReturnValue('/en/rest-client/POST/dGVzdC11cmw=/');
  mockUseSearchParams.mockReturnValue(new URLSearchParams());
  vi.spyOn(window.history, 'replaceState');
});

describe('SelectClient', () => {
  it('render', () => {
    render(<SelectClient select="POST" />);

    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('change value', () => {
    render(<SelectClient select="POST" />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const getOption = screen.getAllByText('GET')[1];
    fireEvent.click(getOption);

    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      '',
      '/en/rest-client/GET/dGVzdC11cmw=/?'
    );
  });

  it('correct CSS', () => {
    render(<SelectClient select="POST" />);

    const select = screen.getByRole('combobox');
    expect(select.parentElement).toHaveClass('ant-select-selection-search');
  });

  it('handle URL', () => {
    const searchParams = new URLSearchParams();
    searchParams.set('param1', 'value1');
    mockUseSearchParams.mockReturnValue(searchParams);

    render(<SelectClient select="POST" />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const putOption = screen.getByText('PUT');
    fireEvent.click(putOption);

    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      '',
      '/en/rest-client/PUT/dGVzdC11cmw=/?param1=value1'
    );
  });

  it('handle different path', () => {
    mockUsePathname.mockReturnValue('/en/rest-client/GET/');

    render(<SelectClient select="GET" />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const deleteOption = screen.getByText('DELETE');
    fireEvent.click(deleteOption);

    expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/en/rest-client/DELETE/?');
  });
});
