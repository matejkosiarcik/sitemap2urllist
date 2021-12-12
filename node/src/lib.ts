import * as sitemap2urllist from '../wasm/sitemap2urllist';

export async function convert(input: string, _alternate?: boolean): Promise<string[]> {
  const alternate = _alternate ?? false;
  return await sitemap2urllist.convert(input, alternate);
}

export function save(output: string, urls: string[]): void {
  return sitemap2urllist.save(output, urls);
}

export function version(): string {
  return sitemap2urllist.version();
}
