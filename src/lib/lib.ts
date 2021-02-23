import { xml2json } from 'xml-js';
import { URL } from 'url';
import 'isomorphic-fetch';

export class Options {
    readonly encoding: BufferEncoding | null;

    constructor(encoding: BufferEncoding | null = null) {
        this.encoding = encoding;
    }
}

async function getSitemapContent(data: string | Buffer | URL, options: Options | null): Promise<string> {
    // TODO: accept URL?
    let xml: string;

    if (Buffer.isBuffer(data)) {
        xml = data.toString(options?.encoding ?? 'utf-8');
    } else if (typeof data === 'string') {
        xml = data.trim();
    } else if (data instanceof URL) {
        // if (data.protocol === 'file:') {
        //     // TODO: read file
        //     // data.pathname
        // } else if (data.protocol === 'https:' || data.protocol === 'http:') {
        //     // TODO: fetch url
        //     // await fetch(data.href)
        // }
        throw new Error(`URLs not yet supported`);
    } else {
        throw new Error(`Unknown input "${data}" of type ${typeof data}`);
    }
    return xml;
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

function parseSingleEntry(entry: any): SitemapEntry {
    const locationURL: string = (() => {
        try {
            return entry['loc']['_text'];
        } catch (_) {
            return '';
        }
    })();

    const priority: number = (() => {
        try {
            const textPriority = entry['priority']['_text'];
            return parseFloat(textPriority);
        } catch (_) {
            return 0.5;
        }
    })();

    const alternativeURLs: string[] = [entry['xhtml:link']]
        .flatMap(el => el) // flatten potential 2D array
        .filter(el => {
            try {
                return el['_attributes']['href'];
            } catch (_) {
                return false;
            }
        })
        .map(el => el['_attributes']['href'])
        .filter(el => el) // remove empty urls
        .sort();

    return new SitemapEntry(locationURL, alternativeURLs, priority);
}

/**
 * Parses root <urlset>
 */
function parseUrlSet(json: any): SitemapEntry[] {
    const urls = json['urlset']['url'];
    let output: SitemapEntry[] = [];

    if (Array.isArray(urls)) {
        output = urls.map(url => parseSingleEntry(url));
    } else if (urls) {
        output.push(parseSingleEntry(urls));
    }
    return output;
}

/**
 * Parses root <sitemapindex>
 */
async function parseSitemapIndex(json: any): Promise<SitemapEntry[]> {
    throw new Error(`<sitemapindex> not supported yet. ${json}`);
}

/**
 * parse full sitemap.xml
 */
async function parseSitemap(xml: string): Promise<SitemapEntry[]> {
    const json = JSON.parse(xml2json(xml, { compact: true, spaces: 0 }));
    if (json['urlset']) {
        return parseUrlSet(json);
    } else if (json['sitemapindex']) {
        return await parseSitemapIndex(json);
    } else {
        throw new Error(`Invalid xml. Expected top level "urlset" or "sitemapindex". Found: ${xml}`);
    }
}

function convertEntriesToUrls(entries: SitemapEntry[]): string[] {
    const sorter = (left: SitemapEntry, right: SitemapEntry): number => {
        if (right.priority != left.priority) {
            return right.priority - left.priority;
        }
        return left.url.localeCompare(right.url);
    }

    return entries
        .sort(sorter)
        .flatMap(entry => [entry.url].concat(entry.altUrls))
        .filter(el => el); // remove empty urls
}

export async function sitemap2urllist(data: string | Buffer, options: Options | null = null): Promise<string> {
    const xml = await getSitemapContent(data, options);
    const entries = await parseSitemap(xml);
    const urls = convertEntriesToUrls(entries);
    return urls.join('\n') + (urls.length > 0 ? '\n' : '');
}
