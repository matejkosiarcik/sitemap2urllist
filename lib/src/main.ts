import { xml2json } from 'xml-js'
import 'isomorphic-fetch'

export class Options {
    readonly encoding: BufferEncoding | null

    constructor(encoding: BufferEncoding | null = null) {
        this.encoding = encoding
    }
}

function getSitemapContent(data: string | Buffer, options: Options | null): string {
    // TODO: accept URL?
    let xml: string
    if (Buffer.isBuffer(data)) {
        xml = data.toString(options?.encoding ?? 'utf-8')
    } else if (typeof data === 'string') {
        xml = data
    } else {
        throw `Unknown input "${data}" of type ${typeof data}`
    }
    return xml
}

class SitemapEntry {
    readonly url: string
    readonly altUrls: string[]
    readonly priority: number

    constructor(url: string, altUrls: string[], priority: number) {
        this.url = url
        this.altUrls = altUrls
        this.priority = priority
    }
}

function parseSingleEntry(entry: any): SitemapEntry {
    let loc: string
    try {
        loc = entry['loc']['_text']
    } catch (err) {
        loc = ''
    }

    let priority: string
    try {
        priority = entry['priority']['_text']
    } catch (err) {
        priority = '0.5'
    }

    return new SitemapEntry(loc, [], parseFloat(priority))
}

function parseSitemapToEntries(xml: string): SitemapEntry[] {
    const json = JSON.parse(xml2json(xml, { compact: true, spaces: 0 }))
    const urls = json['urlset']['url']
    let output: SitemapEntry[] = []

    if (Array.isArray(urls)) {
        output = urls.map(url => parseSingleEntry(url))
    } else if (urls) {
        output.push(parseSingleEntry(urls))
    }
    return output
}

function convertEntriesToUrls(entries: SitemapEntry[]): string[] {
    return entries.sort((left, right) => right.priority - left.priority).map(entry => entry.url)
}

export function sitemap2urllist(data: string | Buffer, options: Options | null = null): string {
    const xml = getSitemapContent(data, options)
    const entries = parseSitemapToEntries(xml)
    const urls = convertEntriesToUrls(entries)
    // TODO: benchmark on huge sitemaps (depending on results consider streams or promises)
    return urls.join('\n') + (urls.length > 0 ? '\n' : '')
}
