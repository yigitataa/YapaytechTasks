export type HtmlFetcher = typeof fetch;

export interface FetchHtmlOptions {
  fetcher?: HtmlFetcher;
  sourceName: string;
  timeoutMs: number;
  userAgent: string;
}

export async function fetchHtml(url: string, options: FetchHtmlOptions): Promise<string> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), options.timeoutMs);

  try {
    const response = await (options.fetcher ?? fetch)(url, {
      method: 'GET',
      redirect: 'error',
      signal: abortController.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': options.userAgent,
      },
    });

    if (!response.ok) {
      throw new Error(`${options.sourceName} ${response.status} döndürdü.`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.toLocaleLowerCase('en-US').includes('text/html')) {
      throw new Error(`${options.sourceName} beklenmeyen içerik türü döndürdü: ${contentType}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}
