import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrentVariable from './CurrentVariable';
import { useTranslations } from 'next-intl';
import type { VariableRecord } from '@/types/types';

interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
}

interface RowSelection {
  selectedRowKeys: React.Key[];
  onChange: (keys: React.Key[]) => void;
}

type VariableRecordWithIndex = VariableRecord & Record<string, unknown>;

type MockTranslationFunction = (key: string) => string;

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Table: ({
      rowSelection,
      dataSource,
      columns,
      rowKey,
    }: {
      rowSelection?: RowSelection;
      dataSource: VariableRecord[];
      columns: TableColumn[];
      rowKey: string;
    }) => (
      <div data-testid="table">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((item) => {
              const itemWithIndex = item as VariableRecordWithIndex;
              const keyValue = itemWithIndex[rowKey] as React.Key;
              return (
                <tr key={keyValue} data-testid={`row-${keyValue}`}>
                  {columns.map((col) => (
                    <td key={col.key}>{itemWithIndex[col.dataIndex] as string}</td>
                  ))}
                  {rowSelection && (
                    <td>
                      <input
                        type="checkbox"
                        checked={rowSelection.selectedRowKeys.includes(keyValue)}
                        onChange={() =>
                          rowSelection.onChange(
                            rowSelection.selectedRowKeys.includes(keyValue)
                              ? rowSelection.selectedRowKeys.filter((k) => k !== keyValue)
                              : [...rowSelection.selectedRowKeys, keyValue]
                          )
                        }
                        data-testid={`checkbox-${keyValue}`}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ),
    Button: ({
      children,
      type,
      danger,
      onClick,
      disabled,
      className,
    }: {
      children: React.ReactNode;
      type?: string;
      danger?: boolean;
      onClick?: () => void;
      disabled?: boolean;
      className?: string;
    }) => (
      <button
        data-testid="delete-button"
        data-type={type}
        data-danger={danger}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    ),
    ConfigProvider: ({
      children,
      theme,
    }: {
      children: React.ReactNode;
      theme?: { token: { colorTextDisabled: string } };
    }) => (
      <div data-testid="config-provider" data-theme={JSON.stringify(theme)}>
        {children}
      </div>
    ),
  };
});

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

const defaultProps = {
  listVar: [
    { key: 'id', variable: 'id', value: '123' },
    { key: 'name', variable: 'name', value: 'Alice' },
  ],
  delVar: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  const mockFn: MockTranslationFunction = (key: string) => `Translated_${key}`;
  vi.mocked(useTranslations).mockReturnValue(mockFn as never);
});

describe('CurrentVariable', () => {
  it('render not empty', () => {
    render(<CurrentVariable {...defaultProps} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Translated_current_variable'
    );

    const table = screen.getByTestId('table');
    expect(table).toBeInTheDocument();

    expect(screen.getByText('Translated_key_variable')).toBeInTheDocument();
    expect(screen.getByText('Translated_value_variable')).toBeInTheDocument();

    expect(screen.getByTestId('row-id')).toHaveTextContent('id');
    expect(screen.getByTestId('row-id')).toHaveTextContent('123');
    expect(screen.getByTestId('row-name')).toHaveTextContent('name');
    expect(screen.getByTestId('row-name')).toHaveTextContent('Alice');

    expect(screen.getByTestId('checkbox-id')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-name')).toBeInTheDocument();

    expect(screen.getByTestId('delete-button')).toHaveTextContent('Translated_delete_var');
    expect(screen.getByTestId('delete-button')).toHaveAttribute('data-type', 'primary');
    expect(screen.getByTestId('delete-button')).toHaveAttribute('data-danger', 'true');
    expect(screen.getByTestId('delete-button')).toBeDisabled();

    expect(screen.getByTestId('config-provider')).toHaveAttribute(
      'data-theme',
      JSON.stringify({ token: { colorTextDisabled: 'rgba(255, 0, 0, 0.7)' } })
    );
  });

  it('render empty', () => {
    render(<CurrentVariable {...defaultProps} listVar={[]} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Translated_no_variables');
    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  it('enable delete', async () => {
    render(<CurrentVariable {...defaultProps} />);

    const checkbox = screen.getByTestId('checkbox-id');
    fireEvent.click(checkbox);

    const deleteButton = screen.getByTestId('delete-button');
    expect(deleteButton).not.toBeDisabled();
    expect(checkbox).toBeChecked();
  });

  it('call delVar', async () => {
    const delVar = vi.fn();
    render(<CurrentVariable {...defaultProps} delVar={delVar} />);

    const checkbox = screen.getByTestId('checkbox-id');
    fireEvent.click(checkbox);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(delVar).toHaveBeenCalledWith(['id']);
    expect(checkbox).not.toBeChecked();
  });

  it('update selectedRowKeys', async () => {
    render(<CurrentVariable {...defaultProps} />);

    const checkboxId = screen.getByTestId('checkbox-id');
    const checkboxName = screen.getByTestId('checkbox-name');

    fireEvent.click(checkboxId);
    expect(checkboxId).toBeChecked();
    expect(checkboxName).not.toBeChecked();

    fireEvent.click(checkboxName);
    expect(checkboxId).toBeChecked();
    expect(checkboxName).toBeChecked();

    fireEvent.click(checkboxId);
    expect(checkboxId).not.toBeChecked();
    expect(checkboxName).toBeChecked();
  });

  it('translation', () => {
    render(<CurrentVariable {...defaultProps} />);

    expect(screen.getByText('Translated_current_variable')).toBeInTheDocument();
    expect(screen.getByText('Translated_key_variable')).toBeInTheDocument();
    expect(screen.getByText('Translated_value_variable')).toBeInTheDocument();
    expect(screen.getByText('Translated_delete_var')).toBeInTheDocument();

    expect(vi.mocked(useTranslations)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(useTranslations)).toHaveBeenCalledWith();
  });

  it('render translation values', () => {
    const customMockFn: MockTranslationFunction = (key: string) => `Custom_${key}`;
    vi.mocked(useTranslations).mockReturnValue(customMockFn as never);
    render(<CurrentVariable {...defaultProps} />);

    expect(screen.getByText('Custom_current_variable')).toBeInTheDocument();
    expect(screen.getByText('Custom_key_variable')).toBeInTheDocument();
    expect(screen.getByText('Custom_value_variable')).toBeInTheDocument();
    expect(screen.getByText('Custom_delete_var')).toBeInTheDocument();
  });
});
