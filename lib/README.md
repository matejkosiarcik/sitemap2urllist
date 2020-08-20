# Sitemap to Urllist (library)

> Simple sitemap.xml to urllist.txt converter
>
> Package name: `sitemap2urllist`
>
> Also available as a CLI `sitemap2urllist-cli`

<!-- toc -->

<!-- tocstop -->

## Installation

```sh
npm install --save sitemap2urllist
```

## Usage

JavaScript:

```js
const sitemap2urllist = require('sitemap2urllist').sitemap2urllist
const sitemapXmlContent: string = ...
const urllistTxtContent: string = sitemap2urllist(sitemapXmlContent)
```

TypeScript (types are included):

```ts
import { sitemap2urllist } from 'sitemap2urllist'
const sitemapXmlContent: string = ...
const urllistTxtContent: string = sitemap2urllist(sitemapXmlContent)
```
