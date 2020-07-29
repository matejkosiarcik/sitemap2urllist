import { xml2json } from 'xml-js'
import 'isomorphic-fetch'

export class Options {
    encoding: BufferEncoding | null

    constructor(encoding: BufferEncoding | null = null) {
        this.encoding = encoding
    }
}

export function sitemap2urllist(data: string | Buffer, options: Options | null = null): string {
    let xml: string
    if (Buffer.isBuffer(data)) {
        xml = data.toString(options?.encoding ?? 'utf-8')
    } else if (typeof data === 'string') {
        xml = data
    } else {
        throw `Unknown input "${data}" of type ${typeof data}`
    }

    const json = JSON.parse(xml2json(xml, { compact: true, spaces: 0 }))
    const urls = json['urlset']['url']
    let output: string[]

    if (Array.isArray(urls)) {
        output = urls.map(url => url['loc']['_text'])
    } else if (urls) {
        output = [urls['loc']['_text']]
    } else {
        output = []
    }
    return output.join('\n') + (output.length > 0 ? '\n' : '')
}
