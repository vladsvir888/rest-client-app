import { render, screen, fireEvent } from '@testing-library/react';
import { RestClientProvider, RestClientContext } from './RestClientProvider';
import { describe, it, expect } from 'vitest';
import { useContext } from 'react';

const TestConsumer = () => {
  const context = useContext(RestClientContext);

  return (
    <div>
      <div data-testid="response">{JSON.stringify(context.response)}</div>
      <div data-testid="errorInput">{context.errorInput ? 'true' : 'false'}</div>
      <div data-testid="errorBody">{context.errorBody ? 'true' : 'false'}</div>
      <div data-testid="errorHeader">{context.errorHeader ? 'true' : 'false'}</div>
      <button
        onClick={() => context.setResponse?.({ status: 200, res: 'test response' })}
        data-testid="set-response"
      >
        Set Response
      </button>
      <button onClick={() => context.setErrorInput?.(true)} data-testid="set-error-input">
        Set Error Input
      </button>
      <button onClick={() => context.setErrorBody?.(true)} data-testid="set-error-body">
        Set Error Body
      </button>
      <button onClick={() => context.setErrorHeader?.(true)} data-testid="set-error-header">
        Set Error Header
      </button>
    </div>
  );
};

describe('RestClientProvider', () => {
  it('initial context', () => {
    render(
      <RestClientProvider>
        <TestConsumer />
      </RestClientProvider>
    );

    expect(screen.getByTestId('response')).toHaveTextContent(
      JSON.stringify({ res: '', status: -1 })
    );
    expect(screen.getByTestId('errorInput')).toHaveTextContent('true');
    expect(screen.getByTestId('errorBody')).toHaveTextContent('false');
    expect(screen.getByTestId('errorHeader')).toHaveTextContent('false');
  });

  it('update response', () => {
    render(
      <RestClientProvider>
        <TestConsumer />
      </RestClientProvider>
    );

    const setResponseButton = screen.getByTestId('set-response');
    fireEvent.click(setResponseButton);

    expect(screen.getByTestId('response')).toHaveTextContent(
      JSON.stringify({ status: 200, res: 'test response' })
    );
  });

  it('update errorInput', () => {
    render(
      <RestClientProvider>
        <TestConsumer />
      </RestClientProvider>
    );

    const setErrorInputButton = screen.getByTestId('set-error-input');
    fireEvent.click(setErrorInputButton);

    expect(screen.getByTestId('errorInput')).toHaveTextContent('true');
  });

  it('update errorBody', () => {
    render(
      <RestClientProvider>
        <TestConsumer />
      </RestClientProvider>
    );

    const setErrorBodyButton = screen.getByTestId('set-error-body');
    fireEvent.click(setErrorBodyButton);

    expect(screen.getByTestId('errorBody')).toHaveTextContent('true');
  });

  it('update errorHeader', () => {
    render(
      <RestClientProvider>
        <TestConsumer />
      </RestClientProvider>
    );

    const setErrorHeaderButton = screen.getByTestId('set-error-header');
    fireEvent.click(setErrorHeaderButton);

    expect(screen.getByTestId('errorHeader')).toHaveTextContent('true');
  });

  it('provides context', () => {
    const NestedTest = () => {
      const context = useContext(RestClientContext);
      return <div data-testid="nested-response">{JSON.stringify(context.response)}</div>;
    };

    render(
      <RestClientProvider>
        <div>
          <NestedTest />
        </div>
      </RestClientProvider>
    );

    expect(screen.getByTestId('nested-response')).toHaveTextContent(
      JSON.stringify({ res: '', status: -1 })
    );
  });

  it('memoize context', () => {
    render(
      <RestClientProvider>
        <TestConsumer />
      </RestClientProvider>
    );

    expect(screen.getByTestId('response')).toHaveTextContent(
      JSON.stringify({ res: '', status: -1 })
    );
  });
});
