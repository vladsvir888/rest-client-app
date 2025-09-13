import { render, screen } from '@testing-library/react';
import { RestClient } from './RestClient';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../Body/Body', () => ({
  Body: ({ body }: { body: string }) => <div data-testid="body">Body: {body}</div>,
}));

vi.mock('../CodeGenerator/CodeGenerator', () => ({
  CodeGenerator: () => <div data-testid="code-generator">CodeGenerator</div>,
}));

vi.mock('../Headers/Headers', () => ({
  Headers: ({ headers }: { headers: { key: string; value: string | undefined }[] }) => (
    <div data-testid="headers">
      Headers: {headers.map((header) => `${header.key}:${header.value}`).join(', ')}
    </div>
  ),
}));

vi.mock('../Response/Response', () => ({
  Response: () => <div data-testid="response">Response</div>,
}));

vi.mock('../UrlLine/UrlLine', () => ({
  UrlLine: ({ select, url }: { select: string; url: string }) => (
    <div data-testid="url-line">
      UrlLine: {select} - {url}
    </div>
  ),
}));

vi.mock('./RestClient.module.css', () => ({
  default: {
    wrapper: 'wrapper-mocked',
  },
}));

const mockProps = {
  url: 'https://api.example.com/users',
  select: 'GET',
  headers: [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token' },
  ],
  body: '{"name": "John"}',
};

describe('RestClient', () => {
  it('render', () => {
    render(<RestClient {...mockProps} />);

    expect(screen.getByTestId('url-line')).toHaveTextContent(
      'UrlLine: GET - https://api.example.com/users'
    );
    expect(screen.getByTestId('headers')).toHaveTextContent(
      'Headers: Content-Type:application/json, Authorization:Bearer token'
    );
    expect(screen.getByTestId('body')).toHaveTextContent('Body: {"name": "John"}');
    expect(screen.getByTestId('code-generator')).toBeInTheDocument();
    expect(screen.getByTestId('response')).toBeInTheDocument();

    const wrapper = screen.getByTestId('url-line').parentElement;
    expect(wrapper).toHaveClass('wrapper-mocked');
  });

  it('render empty header', () => {
    const emptyProps = {
      url: 'https://api.example.com',
      select: 'POST',
      headers: [],
      body: '',
    };

    render(<RestClient {...emptyProps} />);

    expect(screen.getByTestId('url-line')).toHaveTextContent(
      'UrlLine: POST - https://api.example.com'
    );
    expect(screen.getByTestId('headers')).toHaveTextContent('Headers:');
    expect(screen.getByTestId('body')).toHaveTextContent('Body:');
  });

  it('render undefined header', () => {
    const propsWithUndefinedHeaders = {
      url: 'https://api.example.com',
      select: 'PUT',
      headers: [
        { key: 'Content-Type', value: undefined },
        { key: 'Accept', value: 'application/json' },
      ],
      body: '{"id": 1}',
    };

    render(<RestClient {...propsWithUndefinedHeaders} />);

    expect(screen.getByTestId('headers')).toHaveTextContent(
      'Headers: Content-Type:undefined, Accept:application/json'
    );
  });
});
