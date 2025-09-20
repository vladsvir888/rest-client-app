import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VariableInfo from './VariableInfo';
import { getVariables } from '@/utils/applyVariables';
import type { VariableRecord } from '@/types/types';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'window', {
  value: {
    localStorage: localStorageMock,
  },
  writable: true,
});

vi.mock('@/utils/applyVariables', () => ({
  getVariables: vi.fn(),
}));

vi.mock('./CreateVariable', () => ({
  default: ({ createVar }: { createVar: (key: string, value: string) => void }) => (
    <div data-testid="create-variable">
      <button data-testid="create-button" onClick={() => createVar('newKey', 'newValue')}>
        Create Variable
      </button>
    </div>
  ),
}));

vi.mock('./CurrentVariable', () => ({
  default: ({
    listVar,
    delVar,
  }: {
    listVar: VariableRecord[];
    delVar: (keys: React.Key[]) => void;
  }) => (
    <div data-testid="current-variable">
      {listVar.map((item) => (
        <div key={item.key} data-testid={`variable-${item.key}`}>
          {item.variable}: {item.value}
          <button data-testid={`delete-button-${item.key}`} onClick={() => delVar([item.key])}>
            Delete
          </button>
        </div>
      ))}
    </div>
  ),
}));

const authUser = 'user1';

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue('{}');
  vi.mocked(getVariables).mockReturnValue({});
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('VariableInfo', () => {
  it('render', () => {
    render(<VariableInfo authUser={authUser} />);

    expect(screen.getByTestId('create-variable')).toBeInTheDocument();
    expect(screen.getByTestId('current-variable')).toBeInTheDocument();
  });

  it('initial', () => {
    const variables = { id: '123', name: 'Alice' };
    vi.mocked(getVariables).mockReturnValue(variables);

    render(<VariableInfo authUser={authUser} />);

    expect(getVariables).toHaveBeenCalledWith(authUser);
    expect(screen.getByTestId('variable-id')).toHaveTextContent('id: 123');
    expect(screen.getByTestId('variable-name')).toHaveTextContent('name: Alice');
  });

  it('handle empty variables', () => {
    vi.mocked(getVariables).mockReturnValue({});

    render(<VariableInfo authUser={authUser} />);

    expect(getVariables).toHaveBeenCalledWith(authUser);
    expect(screen.queryByTestId(/variable-/)).not.toBeInTheDocument();
  });

  it('create a new variable', async () => {
    render(<VariableInfo authUser={authUser} />);

    const createButton = screen.getByTestId('create-button');
    fireEvent.click(createButton);

    expect(screen.getByTestId('variable-newKey')).toHaveTextContent('newKey: newValue');
  });

  it('delete a variable', async () => {
    vi.mocked(getVariables).mockReturnValue({ id: '123', name: 'Alice' });

    render(<VariableInfo authUser={authUser} />);

    expect(screen.getByTestId('variable-id')).toBeInTheDocument();
    expect(screen.getByTestId('variable-name')).toBeInTheDocument();

    const deleteButton = screen.getByTestId('delete-button-id');
    fireEvent.click(deleteButton);

    expect(screen.queryByTestId('variable-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('variable-name')).toBeInTheDocument();
  });

  it('update listVar', () => {
    vi.mocked(getVariables)
      .mockReturnValueOnce({ id: '123' })
      .mockReturnValueOnce({ name: 'Alice' });

    const { rerender } = render(<VariableInfo authUser="user1" />);

    expect(screen.getByTestId('variable-id')).toHaveTextContent('id: 123');

    rerender(<VariableInfo authUser="user2" />);

    expect(screen.queryByTestId('variable-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('variable-name')).toHaveTextContent('name: Alice');
    expect(getVariables).toHaveBeenCalledWith('user2');
  });

  it('window undefined', () => {
    const originalWindow = global.window;

    vi.mocked(getVariables).mockReturnValue({});

    render(<VariableInfo authUser={authUser} />);

    expect(getVariables).toHaveBeenCalledWith(authUser);
    expect(screen.getByTestId('create-variable')).toBeInTheDocument();
    expect(screen.getByTestId('current-variable')).toBeInTheDocument();
    expect(screen.queryByTestId(/variable-/)).not.toBeInTheDocument();

    global.window = originalWindow;
  });
});
