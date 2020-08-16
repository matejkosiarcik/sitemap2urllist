# Sitemap to Urllist

> Simple sitemap.xml to urllist.txt converter

<!-- toc -->

- [Installation](#installation)
- [CLI usage](#cli-usage)
- [Library usage](#library-usage)
- [Limitations](#limitations)
- [Similar projects](#similar-projects)

<!-- tocstop -->

## Installation

```sh
npm install @matejkosiarcik/sitemap2urllist # to use as library
npm install --save-dev @matejkosiarcik/sitemap2urllist-cli # to use as cli
```

## CLI usage

```sh
$ sitemap2urllist --help
# TODO: help
```

## Library usage

JavaScript:

```js
const sitemap2urllist = require('@matejkosiarcik/sitemap2urllist').sitemap2urllist
const sitemapXmlContent: string = ...
const urllistTxtContent: string = sitemap2urllist(sitemapXmlContent)
```

TypeScript (types included):

```ts
import { sitemap2urllist } from '@matejkosiarcik/sitemap2urllist'
const sitemapXmlContent: string = ...
const urllistTxtContent: string = sitemap2urllist(sitemapXmlContent)
```

## Limitations

Does not support sitemap references (xpath: `/sitemapindex/sitemap/loc`).

## Similar projects

I could not find anything available to run locally (from terminal).

Kinda similar tools:

[robhammond.co/tools/xml-extract](https://robhammond.co/tools/xml-extract) (only website)
