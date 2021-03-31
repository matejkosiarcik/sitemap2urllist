/* eslint-disable max-classes-per-file, no-underscore-dangle */
import { xml2json } from 'xml-js';
import { URL } from 'url';
import * as fs from 'fs';
import fetch from 'node-fetch';

export class Options {
  readonly encoding: BufferEncoding | null;

  constructor(encoding: BufferEncoding | null = null) {
    this.encoding = encoding;
  }
}

/**
 * reads content from URL
 * supported protocols: file, http(s)
 */
async function readUrl(location: URL, encoding: BufferEncoding): Promise<string> {
  if (location.protocol === 'file:') {
    return fs.readFileSync(location.pathname, encoding);
  }
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    const response = await fetch(location.href);
    if (!response.ok) {
      throw new Error(`Error response, got status: ${response.status} for ${location.href}`);
    }
    const contentSubTypes = (response.headers.get('content-type') ?? '').split(';').map((el) => el.trim());
    if (!contentSubTypes.includes('text/xml') && !contentSubTypes.includes('application/xml')) {
      throw new Error(`Unsupported Content-Type, got: ${response.headers.get('content-type')}. Expected text/xml or application/xml`);
    }
    return response.text();
  }

  throw new Error(`Unsupported URL protocol "${location.protocol}" (${location})`);
}

async function readInput(data: string | Buffer | URL, options: Options): Promise<string> {
  if (Buffer.isBuffer(data)) {
    return data.toString(options.encoding ?? 'utf-8');
  }
  if (typeof data === 'string') {
    return data;
  }
  if (data instanceof URL) {
    return readUrl(data, options.encoding ?? 'utf-8');
  }

  throw new Error(`Unknown input "${data}" of type ${typeof data}`);
}

class SitemapEntry {
  readonly url: string;

  readonly altUrls: string[];

  readonly priority: number;

  constructor(url: string, altUrls: string[], priority: number) {
    this.url = url;
    this.altUrls = altUrls;
    this.priority = priority;
  }
}

/**
 * Parses root <urlset>
 */
function parseUrlset(json: any): SitemapEntry[] {
  const urls = json.urlset.url;
  let output: SitemapEntry[] = [];

  /**
   * convert raw xml to object for single url entry
   */
  function parseSingleUrl(entry: any): SitemapEntry {
    const locationURL: string = (() => {
      try {
        return entry.loc._text;
      } catch (_) {
        return '';
      }
    })();

    const priority: number = (() => {
      try {
        const textPriority = entry.priority._text;
        return parseFloat(textPriority);
      } catch (_) {
        return 0.5;
      }
    })();

    const alternativeURLs: string[] = [entry['xhtml:link']]
      .flatMap((el) => el) // flatten potential 2D array
      .filter((el) => {
        try {
          return el._attributes.href;
        } catch (_) {
          return false;
        }
      })
      .map((el) => el._attributes.href)
      .filter((el) => el) // remove empty urls
      .sort();

    return new SitemapEntry(locationURL, alternativeURLs, priority);
  }

  if (Array.isArray(urls)) {
    output = urls.map((url) => parseSingleUrl(url));
  } else if (urls) {
    output.push(parseSingleUrl(urls));
  }
  return output;
}

/**
 * parse full sitemap.xml
 */
async function parseSitemapContent(input: string | Buffer | URL, options: Options): Promise<SitemapEntry[]> {
  const xml = await readInput(input, options);
  const json = JSON.parse(xml2json(xml, { compact: true, spaces: 0 }));

  if (json.urlset) {
    return parseUrlset(json);
  }

  if (json.sitemapindex) {
    throw new Error('Not supported <sitemapindex> xml. Only accepting <urlset>.');
  }
  throw new Error(`Invalid xml. Expected top level "urlset" or "sitemapindex". Found: ${xml}`);
}

function convertEntriesToUrls(entries: SitemapEntry[]): string[] {
  const sorter = (left: SitemapEntry, right: SitemapEntry): number => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }
    return left.url.localeCompare(right.url);
  };

  return entries
    .sort(sorter)
    .flatMap((entry) => [entry.url].concat(entry.altUrls))
    .filter((el) => el); // remove empty urls
}

export async function sitemap2urllist(data: string | Buffer | URL, options: Options | null = null): Promise<string> {
  const realOptions = options ?? { encoding: 'utf-8' };
  const entries = await parseSitemapContent(data, realOptions);
  const urls = convertEntriesToUrls(entries);
  return urls.join('\n') + (urls.length > 0 ? '\n' : '');
}
