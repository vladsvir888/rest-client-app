import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUrl } from '../../../../lib/parseUrl';
import Page from './page';
import { vi, describe, it, expect, Mock, beforeEach } from 'vitest';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('../../../../lib/parseUrl', () => ({
  parseUrl: vi.fn(),
}));

vi.mock('@/consts/rest-client', () => ({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

vi.mock('../../../../components/RestClient/RestClient', () => ({
  RestClient: vi.fn(() => <div>RestClient</div>),
}));

vi.mock('firebase-admin', () => ({
  default: {
    apps: [],
    initializeApp: vi.fn(),
    credential: {
      cert: vi.fn(() => 'mock-certificate'),
    },
    firestore: vi.fn(),
  },
}));

vi.mock('firebase/app', () => ({
  getApp: vi.fn(),
  getApps: vi.fn(() => []),
  initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

const mockHeaders = headers as Mock;
const mockRedirect = redirect as unknown as Mock;
const mockParseUrl = parseUrl as Mock;

beforeEach(() => {
  vi.clearAllMocks();
  const headersInstance = new Headers();
  headersInstance.set('link', '<https://example.com/en/rest-client>; rel="canonical"');
  mockHeaders.mockResolvedValue(headersInstance);
});

describe('Page', () => {
  it('redirect', async () => {
    mockParseUrl.mockReturnValue({
      pathSegments: ['en', 'rest-client', 'GET'],
    });

    mockRedirect.mockImplementation(() => {
      throw new Error('Redirect');
    });

    await expect(
      Page({ params: Promise.resolve({ slug: undefined }), searchParams: Promise.resolve({}) })
    ).rejects.toThrow('Redirect');

    expect(mockRedirect).toHaveBeenCalledWith('/en/rest-client/GET');
  });

  it('redirect not supported', async () => {
    mockParseUrl.mockReturnValue({
      pathSegments: ['en', 'rest-client', 'GET'],
    });

    mockRedirect.mockImplementation(() => {
      throw new Error('Redirect');
    });

    await expect(
      Page({ params: Promise.resolve({ slug: ['INVALID'] }), searchParams: Promise.resolve({}) })
    ).rejects.toThrow('Redirect');

    expect(mockRedirect).toHaveBeenCalledWith('/en/rest-client/GET');
  });

  it('return RestClient', async () => {
    mockParseUrl.mockReturnValue({
      pathSegments: ['en', 'rest-client', 'GET', 'dGVzdC11cmw=', 'Ym9keQ=='],
    });

    const searchParams = { 'Content-Type': 'application/json', Authorization: 'Bearer token' };

    const result = await Page({
      params: Promise.resolve({ slug: ['GET'] }),
      searchParams: Promise.resolve(searchParams),
    });

    expect(result).toBeDefined();

    expect(mockParseUrl).toHaveBeenCalledWith('https://example.com/en/rest-client');

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('empty searchParams', async () => {
    mockParseUrl.mockReturnValue({
      pathSegments: ['en', 'rest-client', 'GET', 'dGVzdC11cmw=', ''],
    });

    const result = await Page({
      params: Promise.resolve({ slug: ['GET'] }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('array values searchParams', async () => {
    mockParseUrl.mockReturnValue({
      pathSegments: ['en', 'rest-client', 'GET', 'dGVzdC11cmw=', ''],
    });

    const searchParams = {
      Accept: ['application/json', 'text/plain'],
      Authorization: 'Bearer token',
    };

    const result = await Page({
      params: Promise.resolve({ slug: ['GET'] }),
      searchParams: Promise.resolve(searchParams),
    });

    expect(result).toBeDefined();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('header', async () => {
    const headersInstance = new Headers();
    mockHeaders.mockResolvedValue(headersInstance);

    mockParseUrl.mockReturnValue({
      pathSegments: ['en', 'rest-client', 'GET'],
    });

    mockRedirect.mockImplementation(() => {
      throw new Error('Redirect');
    });

    await expect(
      Page({ params: Promise.resolve({ slug: ['INVALID'] }), searchParams: Promise.resolve({}) })
    ).rejects.toThrow('Redirect');

    expect(mockParseUrl).toHaveBeenCalledWith('');
  });
});
