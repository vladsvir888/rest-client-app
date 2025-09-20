import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import VariableTitle from './VariableTitle';
import { useTranslations } from 'next-intl';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => `Translated_${key}`),
}));

describe('VariableTitle', () => {
  it('render', () => {
    render(<VariableTitle />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Translated_variables_page_title');
  });

  it('call useTranslations', () => {
    const useTranslationsSpy = vi.mocked(useTranslations);
    render(<VariableTitle />);

    expect(useTranslationsSpy).toHaveBeenCalledTimes(2);
    expect(useTranslationsSpy).toHaveBeenCalledWith();
  });
});
