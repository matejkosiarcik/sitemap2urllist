# Sitemap-to-Urllist

> Simple sitemap.xml to urllist.txt converter

<!-- toc -->

- [What & Why](#what--why)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Library](#library)
- [Alternatives](#alternatives)
- [Examples](#examples)
- [License](#license)
- [Changes](#changes)

<!-- tocstop -->

## What & Why

What is `sitemap.xml`?
[sitemaps.org](https://www.sitemaps.org/protocol.html) describes it well.
It is a `xml` file that lists your subpages along with some metadata.
It is used mainly for SEO.
You probably already know it.

What is `urllist.txt`?
It's basically a plain text sitemap, 1 line for 1 url (no other metadata).
It was used by _Yahoo!_ search engine back in the days.
Now it is not used by anyone noteworthy AFAIK.

So why bother?
I have found it is great for easy high-level testing of your website, like:

- Example with [webhint](https://github.com/webhintio/hint#readme):
  `curl https://example.com/urllist.txt | xargs -n1 hint`
- Example with [broken-link-checker](https://github.com/stevenvachon/broken-link-checker#readme):
  `curl https://example.com/urllist.txt | xargs -n1 blc`

## Installation

```sh
npm install --save-dev sitemap2urllist
```

Note: package includes typescript definitions

## Usage

### CLI

```sh
$ sitemap2urllist --help
Options:
  -h, --help     Show usage                                            [boolean]
  -V, --version  Show current version                                  [boolean]
  -f, --file     Input file path (- for stdin) or http(s) address
                                              [string] [required] [default: "-"]
  -o, --output   Output file path (- for stdout)
                                              [string] [required] [default: "-"]
```

### Library

JavaScript:

```js
const sitemap2urllist = require('sitemap2urllist').sitemap2urllist;
const urllist = await sitemap2urllist(...); // accepts string | Buffer | URL
```

TypeScript:

```ts
import { sitemap2urllist } from 'sitemap2urllist';
const urllist/*: string*/ = await sitemap2urllist(...); // accepts string | Buffer | URL
```

## Examples

```sh
$ cat /sitemap.xml
<urlset>
  <url>
    <loc>https://example.com</loc>
  </url>
  <url>
    <loc>https://example.com/answer</loc>
    <priority>0.42</priority>
  </url>
</urlset>
$ sitemap2urllist -f /sitemap.xml -o /urllist.txt
$ cat /urllist.txt
https://example.com
https://example.com/answer
```

## Alternatives

- Website converter
  [robhammond.co/tools/xml-extract](https://robhammond.co/tools/xml-extract)
  (does not have export functionality)

I could not find anything available to run locally (in a form of cli/app).

## License

The project is licensed under MIT License.
See [LICENSE](./LICENSE.txt) for full details.

## Changes

Changes in released versions are recorded in [CHANGELOG](./CHANGELOG.md).
