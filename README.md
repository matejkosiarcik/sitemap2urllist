# Sitemap to Urllist

> Simple sitemap.xml to urllist.txt converter

<!-- toc -->

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
