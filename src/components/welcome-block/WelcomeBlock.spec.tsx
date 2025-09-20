import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeAll } from 'vitest';
import WelcomeBlock from './WelcomeBlock';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      welcome: 'Добро пожаловать',
      'main.title': 'Заголовок проекта',
      'main.project': 'Описание проекта',
      'main.titleDescribe': 'Описание школы',
      'main.describeSchool': 'Текст о школе',
      'main.developers': 'Разработчики',
      'main.0': 'Задача 0',
      'main.1': 'Задача 1',
      'main.2': 'Задача 2',
      'main.3': 'Задача 3',
      'main.4': 'Задача 4',
      'main.5': 'Задача 5',
      'main.6': 'Задача 6',
      'main.7': 'Задача 7',
      'main.8': 'Задача 8',
      'main.9': 'Задача 9',
      'main.10': 'Задача 10',
      'main.11': 'Задача 11',
      'main.12': 'Задача 12',
      'main.13': 'Задача 13',
      'main.14': 'Задача 14',
      'main.15': 'Задача 15',
    };
    return dict[key] ?? key;
  },
}));

describe('WelcomeBlock', () => {
  it('render', () => {
    render(<WelcomeBlock authenticated={true} userEmail="test@example.com" />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Добро пожаловать, test@example.com!'
    );
    expect(screen.getByText('Заголовок проекта')).toBeInTheDocument();
    expect(screen.getByText('Описание проекта')).toBeInTheDocument();
    expect(screen.getByText('Разработчики')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Vladislav Svirydovich/i })).toHaveAttribute(
      'href',
      'https://github.com/vladsvir888'
    );
  });

  it('render without email', () => {
    render(<WelcomeBlock authenticated={false} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Добро пожаловать!');
  });

  it('render tasks', () => {
    render(<WelcomeBlock authenticated={true} userEmail="user@mail.com" />);

    expect(screen.getByText('Задача 6')).toBeInTheDocument();
    expect(screen.getByText('Задача 0')).toBeInTheDocument();
    expect(screen.getByText('Задача 14')).toBeInTheDocument();
  });
});
