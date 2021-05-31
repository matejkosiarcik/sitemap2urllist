# Sitemap-to-Urllist

> Simple sitemap.xml to urllist.txt converter

[![npmjs.org version](https://img.shields.io/npm/v/sitemap2urllist)](https://www.npmjs.com/package/sitemap2urllist)

<!-- TODO: [![crates.io version](https://img.shields.io/crates/v/sitemap2urllist)](https://crates.io/crates/sitemap2urllist) -->

<!-- toc -->

- [About](#about)
  - [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Library](#library)
- [Alternatives](#alternatives)
- [License](#license)

<!-- tocstop -->

## About

What is `sitemap.xml`?
[sitemaps.org](https://www.sitemaps.org/protocol.html) describes it well.
It is a `xml` file that lists your subpages along with some metadata.
It is used mainly for SEO.
You probably already know it.

What is `urllist.txt`?
It's basically a plain text sitemap, 1 url per line.
It was used by _Yahoo!_ search engine back in the days.
Now it is not used by anyone noteworthy AFAIK.

So why bother?
I have found it is great for easy high-level testing of your website, like:

- Example with [webhint](https://github.com/webhintio/hint#readme):
  `curl https://example.com/urllist.txt | xargs -n1 hint`
- Example with [broken-link-checker](https://github.com/stevenvachon/broken-link-checker#readme):
  `curl https://example.com/urllist.txt | xargs -n1 blc`

### Features

- 📂 Reading files or stdin
- 🗳 Writing files or stdout
- 🌍 Fetching remote sitemaps with http(s)
- 💯 Support for `<urlset>` and `<sitemapindex>` sitemaps
- 🏎 Super speed with compiled code
- 🎭 Available as _cargo crate_ and _npm package_ (via **webassembly** 😱)
- 💻 Available as both a CLI and library

## Installation

```sh
# rust
cargo install sitemap2urllist # NOTE: not yet ready
# nodejs
npm install --save-dev sitemap2urllist
```

## Usage

### CLI

```sh
$ cat sitemap.xml
<urlset><url><loc>https://example.com</loc></url></urlset>
$ sitemap2urllist -f sitemap.xml -o urllist.txt
$ cat urllist.txt
https://example.com
```

When in doubt, get help:

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

Rust:

```rust
use sitemap2urllist::{convert, save};
// ...
let urllist = convert("sitemap.xml", false).await?; // Vec<String>
save("urllist.txt", urllist)?;
```

JavaScript/TypeScript:

```js
import { convert, save } from 'sitemap2urllist';
// ...
const urllist = await convert('sitemap.xml'); // Array<string>
save('urllist.txt', urllist);
```

## Alternatives

- Website converter
  [robhammond.co/tools/xml-extract](https://robhammond.co/tools/xml-extract)
  (does not have export functionality)

I could not find anything available to run locally (in a form of cli/app).

## License

The project is licensed under MIT License.
See [LICENSE](./LICENSE.txt) for full details.
