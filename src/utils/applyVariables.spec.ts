import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getVariables, applyVariables, VariableMap } from './applyVariables';

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getVariables', () => {
  it('return empty', () => {
    const originalWindow = global.window;

    const result = getVariables('user1');
    expect(result).toEqual({});

    global.window = originalWindow;
  });

  it('return empty object', () => {
    const variables: VariableMap = { id: '123', name: 'Alice' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(variables));

    const result = getVariables('user1');
    expect(result).toEqual({});
  });

  it('return empty object underfund', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const result = getVariables('user1');
    expect(result).toEqual({});
  });

  it('return empty object invalid JSON', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = getVariables('user1');
    expect(result).toEqual({});

    consoleLogSpy.mockRestore();
  });

  it('return empty object empty string', () => {
    localStorageMock.getItem.mockReturnValue('');

    const result = getVariables('user1');
    expect(result).toEqual({});
  });

  it('replace variables', () => {
    const variables: VariableMap = { id: '123', name: 'Alice' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(variables));

    const input = 'Hello {{name}}, your ID is {{id}}!';
    const result = applyVariables(input, 'user1');
    expect(result).toEqual('Hello , your ID is !');
  });

  it('replace variables empty string', () => {
    const variables: VariableMap = { id: '123' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(variables));

    const input = 'Hello {{name}}, your ID is {{id}}!';
    const result = applyVariables(input, 'user1');
    expect(result).toEqual('Hello , your ID is !');
  });

  it('return input', () => {
    const variables: VariableMap = { id: '123' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(variables));

    const input = 'Hello, world!';
    const result = applyVariables(input, 'user1');
    expect(result).toEqual('Hello, world!');
  });

  it('handle empty', () => {
    const variables: VariableMap = { id: '123' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(variables));

    const result = applyVariables('', 'user1');
    expect(result).toEqual('');
  });

  it('handle variables whitespace', () => {
    const variables: VariableMap = { 'user id': '123' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(variables));

    const input = 'ID: {{ user id }}';
    const result = applyVariables(input, 'user1');
    expect(result).toEqual('ID: ');
  });

  it('return input undefined', () => {
    const originalWindow = global.window;

    const input = 'Hello {{name}}!';
    const result = applyVariables(input, 'user1');
    expect(result).toEqual('Hello !');

    global.window = originalWindow;
  });
});
