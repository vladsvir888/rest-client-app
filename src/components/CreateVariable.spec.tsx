import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateVariable from './CreateVariable';
import { useTranslations } from 'next-intl';

type MockTranslationFunction = (key: string) => string;

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Form: ({
      children,
      onFinish,
      className,
    }: {
      children: React.ReactNode;
      onFinish: () => void;
      className?: string;
    }) => (
      <form
        data-testid="form"
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          onFinish();
        }}
      >
        {children}
      </form>
    ),
    Input: ({
      value,
      onChange,
      placeholder,
      className,
    }: {
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      placeholder?: string;
      className?: string;
    }) => (
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        data-testid={`input-${placeholder}`}
      />
    ),
    Button: ({
      children,
      type,
      htmlType,
    }: {
      children: React.ReactNode;
      type?: string;
      htmlType?: 'button' | 'submit' | 'reset';
    }) => (
      <button data-testid="submit-button" type={htmlType} data-type={type}>
        {children}
      </button>
    ),
  };
});

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

const createVar = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  const mockFn: MockTranslationFunction = (key: string) => `Translated_${key}`;
  vi.mocked(useTranslations).mockReturnValue(mockFn as never);
});

describe('CreateVariable', () => {
  it('render', () => {
    render(<CreateVariable createVar={createVar} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Translated_form_title');

    const keyInput = screen.getByTestId('input-Translated_name_var');
    expect(keyInput).toHaveAttribute('placeholder', 'Translated_name_var');
    expect(keyInput).toHaveValue('');

    const valueInput = screen.getByTestId('input-Translated_value_var');
    expect(valueInput).toHaveAttribute('placeholder', 'Translated_value_var');
    expect(valueInput).toHaveValue('');

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveTextContent('Translated_create_variable');
    expect(submitButton).toHaveAttribute('data-type', 'primary');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('update key and value', async () => {
    render(<CreateVariable createVar={createVar} />);

    const keyInput = screen.getByTestId('input-Translated_name_var');
    const valueInput = screen.getByTestId('input-Translated_value_var');

    fireEvent.change(keyInput, { target: { value: 'userId' } });
    fireEvent.change(valueInput, { target: { value: '123' } });

    expect(keyInput).toHaveValue('userId');
    expect(valueInput).toHaveValue('123');
  });

  it('call createVar', async () => {
    render(<CreateVariable createVar={createVar} />);

    const keyInput = screen.getByTestId('input-Translated_name_var');
    const valueInput = screen.getByTestId('input-Translated_value_var');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(keyInput, { target: { value: ' userId ' } });
    fireEvent.change(valueInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    expect(createVar).toHaveBeenCalledWith('userId', '123');
    expect(keyInput).toHaveValue('');
    expect(valueInput).toHaveValue('');
  });

  it('not call createVar', async () => {
    render(<CreateVariable createVar={createVar} />);

    const keyInput = screen.getByTestId('input-Translated_name_var');
    const valueInput = screen.getByTestId('input-Translated_value_var');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(valueInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    expect(createVar).not.toHaveBeenCalled();

    fireEvent.change(valueInput, { target: { value: '' } });
    fireEvent.change(keyInput, { target: { value: 'userId' } });
    fireEvent.click(submitButton);
    expect(createVar).not.toHaveBeenCalled();

    fireEvent.change(keyInput, { target: { value: '' } });
    fireEvent.click(submitButton);
    expect(createVar).not.toHaveBeenCalled();
  });

  it('translation', () => {
    render(<CreateVariable createVar={createVar} />);

    expect(screen.getByText('Translated_form_title')).toBeInTheDocument();
    expect(screen.getByTestId('input-Translated_name_var')).toHaveAttribute(
      'placeholder',
      'Translated_name_var'
    );
    expect(screen.getByTestId('input-Translated_value_var')).toHaveAttribute(
      'placeholder',
      'Translated_value_var'
    );
    expect(screen.getByText('Translated_create_variable')).toBeInTheDocument();

    expect(vi.mocked(useTranslations)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(useTranslations)).toHaveBeenCalledWith();
  });

  it('render translation', () => {
    const customMockFn: MockTranslationFunction = (key: string) => `Custom_${key}`;
    vi.mocked(useTranslations).mockReturnValue(customMockFn as never);
    render(<CreateVariable createVar={createVar} />);

    expect(screen.getByText('Custom_form_title')).toBeInTheDocument();
    expect(screen.getByTestId('input-Custom_name_var')).toHaveAttribute(
      'placeholder',
      'Custom_name_var'
    );
    expect(screen.getByTestId('input-Custom_value_var')).toHaveAttribute(
      'placeholder',
      'Custom_value_var'
    );
    expect(screen.getByText('Custom_create_variable')).toBeInTheDocument();
  });
});
