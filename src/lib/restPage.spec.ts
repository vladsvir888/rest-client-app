import { describe, it, expect } from 'vitest';
import { parseUrl } from './parseUrl';
import { validation } from './validation';

describe('parseUrl', () => {
  it('parse valid URL', () => {
    const url = 'https://example.com/path/to/resource?key1=value1&key2=value2';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual(['path', 'to', 'resource']);
    expect(result.query.get('key1')).toBe('value1');
    expect(result.query.get('key2')).toBe('value2');
  });

  it('URL with domain', () => {
    const url = 'https://example.com';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual([]);
  });

  it('URL with path', () => {
    const url = 'https://example.com/path1/path2';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual(['path1', 'path2']);
  });

  it('URL with query', () => {
    const url = 'https://example.com?param1=value1';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual([]);
    expect(result.query.get('param1')).toBe('value1');
  });

  it('empty URL', () => {
    const url = '';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual(['']);
  });

  it('invalid URL', () => {
    const url = 'invalid-url';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual(['']);
  });

  it('URL with slash', () => {
    const url = 'https://example.com/path/';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual(['path']);
  });

  it('URL with multiple slashes', () => {
    const url = 'https://example.com/path//to///resource';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual(['path', 'to', 'resource']);
  });

  it('query parameters', () => {
    const url = 'https://example.com/path?key1=&key2';
    const result = parseUrl(url);

    expect(result.pathSegments).toEqual(['path']);
    expect(result.query.get('key1')).toBe('');
    expect(result.query.get('key2')).toBe('');
  });
});

describe('validation', () => {
  it('call validate url', () => {
    const url = 'https://api.example.com/{{id}}';
    const variables = { id: '123' };
    const result = validation(url, '', 'url', '', variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: url,
      type: 'var',
    });
  });

  it('call validate body', () => {
    const body = '{"id": "{{id}}"}';
    const query = 'application/json';
    const variables = { id: '123' };
    const result = validation('', body, 'body', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: body,
      type: 'var',
    });
  });

  it('call validate headers', () => {
    const query = 'Authorization: Bearer {{token}}';
    const variables = { token: 'abc123' };
    const result = validation('', '', 'headers', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'token',
      origin: query,
      type: 'var',
    });
  });
  it('should replace variables in URL correctly', () => {
    const url = 'https://api.example.com/{{id}}';
    const variables = { id: '123' };
    const result = validation(url, '', 'url', '', variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: url,
      type: 'var',
    });
  });

  it('return error for URL', () => {
    const url = 'https://api.example.com/{{id}}';
    const variables = {};
    const result = validation(url, '', 'url', '', variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: url,
      type: 'var',
    });
  });

  it('empty URL', () => {
    const url = '';
    const variables = { id: '123' };
    const result = validation(url, '', 'url', '', variables);
    expect(result).toEqual({
      error: false,
      res: '',
      origin: '',
    });
  });

  it('URL without variables', () => {
    const url = 'https://api.example.com';
    const variables = { id: '123' };
    const result = validation(url, '', 'url', '', variables);
    expect(result).toEqual({
      error: false,
      res: 'https://api.example.com',
      origin: url,
    });
  });

  it('decoded URL with variables', () => {
    const url = encodeURIComponent('https://api.example.com/{{id}}');
    const variables = { id: '123' };
    const result = validation(url, '', 'url', '', variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: 'https://api.example.com/{{id}}',
      type: 'var',
    });
  });
  it('replace variables body', () => {
    const body = '{"id": "{{id}}"}';
    const query = 'application/json';
    const variables = { id: '123' };
    const result = validation('', body, 'body', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: body,
      type: 'var',
    });
  });

  it('return error for invalid JSON', () => {
    const body = '{"id": "{{id}}';
    const query = 'application/json';
    const variables = { id: '123' };
    const result = validation('', body, 'body', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: '{"id": "{{id}}',
      type: 'var',
    });
  });

  it('body without variables', () => {
    const body = 'some text';
    const query = 'text/plain';
    const variables = { id: '123' };
    const result = validation('', body, 'body', query, variables);
    expect(result).toEqual({
      error: false,
      res: 'some text',
      origin: body,
    });
  });

  it('should return error for undefined variables in body', () => {
    const body = '{"id": "{{id}}"}';
    const query = 'application/json';
    const variables = {};
    const result = validation('', body, 'body', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: body,
      type: 'var',
    });
  });

  it('should handle decoded body and query', () => {
    const body = encodeURIComponent('{"id": "{{id}}"}');
    const query = encodeURIComponent('application/json');
    const variables = { id: '123' };
    const result = validation('', body, 'body', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'id',
      origin: '{"id": "{{id}}"}',
      type: 'var',
    });
  });
  it('should replace variables in headers correctly', () => {
    const query = 'Authorization: Bearer {{token}}';
    const variables = { token: 'abc123' };
    const result = validation('', '', 'headers', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'token',
      origin: query,
      type: 'var',
    });
  });

  it('return error for undefined', () => {
    const query = 'Authorization: Bearer {{token}}';
    const variables = {};
    const result = validation('', '', 'headers', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'token',
      origin: query,
      type: 'var',
    });
  });

  it('headers without variables', () => {
    const query = 'Content-Type: application/json';
    const variables = { token: 'abc123' };
    const result = validation('', '', 'headers', query, variables);
    expect(result).toEqual({
      error: false,
      res: 'Content-Type: application/json',
      origin: query,
    });
  });

  it('decoded headers', () => {
    const query = encodeURIComponent('Authorization: Bearer {{token}}');
    const variables = { token: 'abc123' };
    const result = validation('', '', 'headers', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'token',
      origin: 'Authorization: Bearer {{token}}',
      type: 'var',
    });
  });
  it('empty variable', () => {
    const url = 'https://api.example.com/{{}}';
    const variables = { id: '123' };
    const result = validation(url, '', 'url', '', variables);
    expect(result).toEqual({
      error: true,
      res: '{{}}',
      origin: url,
      type: 'var',
    });
  });

  it('multiple variables in body', () => {
    const body = '{"greeting": "{{greeting}}", "name": "{{name}}"}';
    const query = 'application/json';
    const variables = { greeting: 'Hello', name: 'Alice' };
    const result = validation('', body, 'body', query, variables);
    expect(result).toEqual({
      error: true,
      res: 'greeting, name',
      origin: body,
      type: 'var',
    });
  });

  it('null or undefined', () => {
    const result = validation('', '', 'url', '', {});
    expect(result).toEqual({
      error: false,
      res: '',
      origin: '',
    });
  });
});
