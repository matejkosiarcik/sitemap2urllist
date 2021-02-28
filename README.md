# Sitemap to Urllist

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
It was used by *Yahoo!* search engine back in the days.
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

## Usage

### CLI

```sh
$ sitemap2urllist --help
Options:
  --help, -h     Show usage                                            [boolean]
  --version, -V  Show current version                                  [boolean]
  --file, -f     Input file path              [string] [required] [default: "-"]
  --output, -o   Output file path             [string] [required] [default: "-"]
```

### Library

JavaScript:

```js
const sitemap2urllist = require('sitemap2urllist').sitemap2urllist;
const urllist = sitemap2urllist(...);
fs.writeFileSync('./sitemap.txt', urllist);
```

TypeScript (types are included):

```ts
import { sitemap2urllist } from 'sitemap2urllist';
const urllist: string = sitemap2urllist(...);
fs.writeFileSync('./sitemap.txt', urllist);
```

## Alternatives

- Website converter
  [robhammond.co/tools/xml-extract](https://robhammond.co/tools/xml-extract)
  (does not have export functionality)

I could not find anything available to run locally (in a form of cli/app).

## Examples

I am successfully using this package on my website at [matejkosiarcik.com](https://matejkosiarcik.com)
to generate [urllist.txt](https://matejkosiarcik.com/urllist.txt) from [sitemap.xml](https://matejkosiarcik.com/sitemap.xml)
\([repository](https://github.com/matejkosiarcik/web) for more info\).

## License

The project is licensed under MIT License.
See [LICENSE](./LICENSE.txt) for full details.

## Changes

Changes in released versions are recorded in [CHANGELOG](./CHANGELOG.md).
