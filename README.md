# Sitemap to Urllist

> Simple sitemap.xml to urllist.txt converter

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [Limitations](#limitations)
- [Similar projects](#similar-projects)

<!-- tocstop -->

## Installation

```sh
npm install --save sitemap2urllist # to use as library
npm install --save-dev sitemap2urllist-cli # to use as cli
```

## Usage

Check out individual usage for:

- [library](./lib/README.md)
- [CLI](./cli/README.md)

## Limitations

Does not support sitemap references (xpath: `/sitemapindex/sitemap/loc`).

## Similar projects

I could not find anything available to run locally (from terminal).

- Website converter
  [robhammond.co/tools/xml-extract](https://robhammond.co/tools/xml-extract)
