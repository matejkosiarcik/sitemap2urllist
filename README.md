# Sitemap-to-Urllist

> Simple sitemap.xml to urllist.txt converter

[![npm](https://img.shields.io/npm/v/sitemap2urllist)](https://www.npmjs.com/package/sitemap2urllist)

<!-- toc -->

- [What & Why](#what--why)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Library](#library)
- [Examples](#examples)
- [Alternatives](#alternatives)
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
sitemap2urllist <version>

USAGE:
    sitemap2urllist [FLAGS] [OPTIONS]

FLAGS:
        --alternate    Include alternate links
    -h, --help         Prints help information
    -V, --version      Prints version information

OPTIONS:
    -f, --file <file>        Input path or URL for sitemap (- for stdin) [default: -]
    -o, --output <output>    Output path for urllist (- for stdout) [default: -]
```

### Library

```ts
import { convert, save } from 'sitemap2urllist';
const urllist: Array<string> = await convert('sitemap.xml', false);
save('urllist.txt', urllist);
```

## Examples

```sh
$ cat sitemap.xml
<urlset>
  <url>
    <loc>https://example.com</loc>
  </url>
</urlset>
$ sitemap2urllist -f sitemap.xml -o urllist.txt
$ cat /urllist.txt
https://example.com
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
