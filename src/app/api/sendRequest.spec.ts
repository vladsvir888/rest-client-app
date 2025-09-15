import { sendRequest } from './sendRequest';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../actions/history.ts', () => ({
  addHistory: vi.fn(),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sendRequest', () => {
  it('GET', async () => {
    const mockResponse = {
      status: 200,
      text: vi.fn().mockResolvedValue('response text'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const method = 'GET';
    const url = 'https://api.example.com/data';
    const body = '';
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(mockFetch).toHaveBeenCalledWith(url, {
      method: 'GET',
      headers,
      body: undefined,
      next: { revalidate: 3600 },
    });
    expect(result).toEqual({ status: 200, res: 'response text' });
  });

  it('POST', async () => {
    const mockResponse = {
      status: 201,
      text: vi.fn().mockResolvedValue('created resource'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const method = 'POST';
    const url = 'https://api.example.com/data';
    const body = '{"name": "John"}';
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(mockFetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers,
      body: '{"name": "John"}',
      next: { revalidate: 3600 },
    });
    expect(result).toEqual({ status: 201, res: 'created resource' });
  });

  it('status > 499', async () => {
    const mockResponse = {
      status: 500,
      text: vi.fn().mockResolvedValue('internal server error'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const method = 'GET';
    const url = 'https://api.example.com/data';
    const body = '';
    const headers = new Headers();

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(result).toEqual({ status: 500, res: 'Server error' });
  });

  it('status > 399', async () => {
    const mockResponse = {
      status: 404,
      text: vi.fn().mockResolvedValue('not found'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const method = 'GET';
    const url = 'https://api.example.com/data';
    const body = '';
    const headers = new Headers();

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(result).toEqual({ status: 404, res: 'Invalid request' });
  });

  it('network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const method = 'GET';
    const url = 'https://api.example.com/data';
    const body = '';
    const headers = new Headers();

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(result).toEqual({ status: -1, res: 'Network error. Could not send request' });
  });

  it('PUT', async () => {
    const mockResponse = {
      status: 200,
      text: vi.fn().mockResolvedValue('updated resource'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const method = 'PUT';
    const url = 'https://api.example.com/data';
    const body = '{"name": "John"}';
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(mockFetch).toHaveBeenCalledWith(url, {
      method: 'PUT',
      headers,
      body: '{"name": "John"}',
      next: { revalidate: 3600 },
    });
    expect(result).toEqual({ status: 200, res: 'updated resource' });
  });

  it('DELETE', async () => {
    const mockResponse = {
      status: 204,
      text: vi.fn().mockResolvedValue(''),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const method = 'DELETE';
    const url = 'https://api.example.com/data';
    const body = '';
    const headers = new Headers();

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(mockFetch).toHaveBeenCalledWith(url, {
      method: 'DELETE',
      headers,
      body: undefined,
      next: { revalidate: 3600 },
    });
    expect(result).toEqual({ status: 204, res: '' });
  });

  it('response text', async () => {
    const mockResponse = {
      status: 200,
      text: vi.fn().mockResolvedValue(''),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const method = 'GET';
    const url = 'https://api.example.com/data';
    const body = '';
    const headers = new Headers();

    const link =
      '/en/rest-client/GET/aHR0cHMlM0ElMkYlMkZqc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tJTJGcG9zdHMlMkYx/';
    const result = await sendRequest(method, url, body, headers, link);

    expect(result).toEqual({ status: 200, res: '' });
  });
});
