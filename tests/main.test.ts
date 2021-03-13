import { sitemap2urllist } from '../src/lib/lib';
import * as path from 'path';
import * as fs from 'fs';
// import { URL } from 'url';
import * as url from 'url';

const projectPath = path.join(__dirname, '..');

describe('Basic tests', () => {
    const inputFilePath = path.join(projectPath, 'sitemaps', 'good', 'single-in.xml');
    const outputFilePath = path.join(projectPath, 'sitemaps', 'good', 'single-out.txt');
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

    test('Filepath as URL', async () => {
        // given
        const inputUrl = url.pathToFileURL(inputFilePath);

        // when
        const testedOutput = await sitemap2urllist(inputUrl);

        // then
        expect(inputUrl.protocol).toBe('file:');
        expect(testedOutput).toBe(referenceOutput);
    });

    test('Fail with invalid file', async () => {
        try {
            await sitemap2urllist('');
            fail();
        } catch (error) {
            // success
        }
    });

    // TODO: Test HTTP URL
    // TODO: Test HTTPS URL
});
