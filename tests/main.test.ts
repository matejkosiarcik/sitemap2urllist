import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { URL } from 'url';
import { sitemap2urllist } from '../src/lib/lib';

const projectPath = path.join(__dirname, '..');

describe('Basic tests', () => {
  const inputFilePath = path.join(projectPath, 'sitemaps', 'single-in.xml');
  const outputFilePath = path.join(projectPath, 'sitemaps', 'single-out.txt');
  const referenceOutput = fs.readFileSync(outputFilePath, 'utf-8');

  test('Raw content as String', async () => {
    // given
    const input: string = fs.readFileSync(inputFilePath, 'utf-8');

    // when
    const testedOutput = await sitemap2urllist(input);

    // then
    expect(testedOutput).toBe(referenceOutput);
  });

  test('Raw content as Buffer', async () => {
    // given
    const input: Buffer = fs.readFileSync(inputFilePath);

    // when
    const testedOutput = await sitemap2urllist(input);

    // then
    expect(testedOutput).toBe(referenceOutput);
  });

  test('Empty string', async () => {
    try {
      const result = await sitemap2urllist('');
      fail(`Should fail, instead got ${result}`);
    } catch (error) {
      // success
    }
  });

  test('Filepath - 1', async () => {
    // given
    const inputUrl = url.pathToFileURL(inputFilePath);
    expect(inputUrl.protocol).toBe('file:');

    // when
    const testedOutput = await sitemap2urllist(inputUrl);

    // then
    expect(testedOutput).toBe(referenceOutput);
  });

  test('Filepath - 2', async () => {
    // given
    const inputUrl = new URL(`file://${inputFilePath}`);

    // when
    const testedOutput = await sitemap2urllist(inputUrl);

    // then
    expect(testedOutput).toBe(referenceOutput);
  });

  test('Filepath - nonexistent', async () => {
    // given
    const inputUrl = new URL('file:///nonexistent.xml');

    try {
      const result = await sitemap2urllist(inputUrl);
      fail(`Should fail, instead got ${result}`);
    } catch (error) {
      // success
    }
  });

  test('Remote sitemap - https', async () => {
    // given
    const inputUrl = new URL('https://www.sitemaps.org/sitemap.xml');

    // when
    const testedOutput = await sitemap2urllist(inputUrl);

    // then
    expect(testedOutput.split('\n').length).toBeGreaterThanOrEqual(2);
  });

  test('Remote sitemap - http', async () => {
    // given
    const inputUrl = new URL('http://www.sitemaps.org/sitemap.xml');

    // when
    const testedOutput = await sitemap2urllist(inputUrl);

    // then
    expect(testedOutput.split('\n').length).toBeGreaterThanOrEqual(2);
  });

  test('Remote sitemap 404 - https', async () => {
    // given
    const inputUrl = new URL('https://www.sitemaps.org/sitemap-nonexistent.xml');

    // when
    try {
      const result = await sitemap2urllist(inputUrl);
      fail(`Should fail, instead got ${result}`);
    } catch (error) {
      // success
    }
  });

  test('Remote sitemap 404 - http', async () => {
    // given
    const inputUrl = new URL('http://www.sitemaps.org/sitemap-nonexistent.xml');

    // when
    try {
      const result = await sitemap2urllist(inputUrl);
      fail(`Should fail, instead got ${result}`);
    } catch (error) {
      // success
    }
  });
});
