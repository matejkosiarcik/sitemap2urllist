import { xml2json } from 'xml-js'
import { URL } from 'url'
import 'isomorphic-fetch'

export class Options {
    readonly encoding: BufferEncoding | null

    constructor(encoding: BufferEncoding | null = null) {
        this.encoding = encoding
    }
}

function getSitemapContent(data: string | Buffer | URL, options: Options | null): string {
    // TODO: accept URL?
    let xml: string
    if (Buffer.isBuffer(data)) {
        xml = data.toString(options?.encoding ?? 'utf-8')
    } else if (typeof data === 'string') {
        xml = data.trim()
    } else if (data instanceof URL) {
        // if (data.protocol === 'file:') {
        //     // TODO: read file
        //     // data.pathname
        // } else if (data.protocol === 'https:' || data.protocol === 'http:') {
        //     // TODO: fetch url
        //     // await fetch(data.href)
        // }
        throw `URLs not yet supported`
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

    let alternates: string[] = []
    const alternatesXml = entry['xhtml:link']
    if (Array.isArray(alternatesXml)) {
        alternatesXml.forEach(alt => {
            try {
                alternates.push(alt['_attributes']['href'])
            } catch (_) { }
        })
    } else if (alternatesXml) {
        try {
            alternates.push(alternatesXml['_attributes']['href'])
        } catch (_) { }
    }

    return new SitemapEntry(loc, alternates.sort(), parseFloat(priority))
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
    const sorter = (left: SitemapEntry, right: SitemapEntry): number => {
        if (right.priority != left.priority) {
            return right.priority - left.priority
        }
        return left.url.localeCompare(right.url)
    }

    return entries.sort(sorter).flatMap(entry => [entry.url].concat(entry.altUrls))
}

export function sitemap2urllist(data: string | Buffer, options: Options | null = null): string {
    const xml = getSitemapContent(data, options)
    const entries = parseSitemapToEntries(xml)
    const urls = convertEntriesToUrls(entries)
    // TODO: benchmark on huge sitemaps (depending on results consider streams or promises)
    return urls.join('\n') + (urls.length > 0 ? '\n' : '')
}
