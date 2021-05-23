import * as sitemap2urllist from '../wasm/sitemap2urllist';

export function convert(input: string, alternate: boolean): Array<string> {
  return sitemap2urllist.convert(input, alternate);
}

export function save(output: string, urls: Array<string>): void {
  return sitemap2urllist.save(output, urls);
}

export function version(): string {
  return sitemap2urllist.version();
}
