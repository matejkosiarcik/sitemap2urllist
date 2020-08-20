# Sitemap to Urllist

> Simple sitemap.xml to urllist.txt converter

<!-- toc -->

- [What & Why](#what--why)
- [Installation](#installation)
- [Usage](#usage)
- [Limitations](#limitations)
- [Similar projects](#similar-projects)

<!-- tocstop -->

## What & Why

What is `sitemap.xml`?
[sitemaps.org](https://www.sitemaps.org/protocol.html) describes it well.
It is a `xml` file that lists your subpages along with metadata.
It is used mainly for SEO.

What is `urllist.txt`?
It's basically a plain text sitemap, 1 line for 1 url (so no extra metadata,
unlike proper sitemap).
It was used by *Yahoo!* search engine back in the days.
Now it is not used by anyone remarkable.

So why bother?
I have found it is great for easily testing your website (and all subpages).

- Example (using [webhint](https://github.com/webhintio/hint#readme)):
  `curl https://example.com/urllist.txt | xargs -n1 hint`.
- Another example (using [broken-link-checker](https://github.com/stevenvachon/broken-link-checker#readme)):
  `curl https://example.com/urllist.txt | xargs -n1 blc`.

## Installation

```sh
npm install --save sitemap2urllist # to use as library
npm install --save-dev sitemap2urllist-cli # to use as cli
```

## Usage

This project publishes packages for usage as:

- [library](./lib/README.md)
- [CLI](./cli/README.md)

## Limitations

Does not support sitemap references (xpath: `/sitemapindex/sitemap/loc`).

## Similar projects

I could not find anything available to run locally (from terminal).

- Website converter
  [robhammond.co/tools/xml-extract](https://robhammond.co/tools/xml-extract)
