import { sitemap2urllist } from '../src/lib/lib';
import * as path from 'path';
import * as fs from 'fs';

const projectPath = path.join(__dirname, '..');

describe('Test good inputs', () => {
    test.each([
        'zero',
        'single',
        'multiple',
        'alternate',
        'order-alphanum',
        'order-priority',
    ])('String sitemaps/%s-in.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-in.xml`)).toString();
        const output = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-out.txt`)).toString();

        // when
        const result = await sitemap2urllist(input);

        // then
        expect(result).toBe(output);
    })

    test.each([
        'zero',
        'single',
        'multiple',
        'alternate',
        'order-alphanum',
        'order-priority',
    ])('Buffer %s-in.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-in.xml`));
        const output = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-out.txt`)).toString();

        // when
        const result = await sitemap2urllist(input);

        // then
        expect(result).toBe(output);
    })
})

describe('Test bad inputs', () => {
    test.each([
        'void',
        'void-with-preamble',
    ])('String sitemaps/%s.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'bad', `${name}.txt`)).toString();

        // when
        let result: any = null;
        let error: any = null;
        try {
            result = await sitemap2urllist(input);
        } catch (err) {
            error = err;
        }

        // then
        expect(result).toBeFalsy();
        expect(error).toBeTruthy();
    })

    test.each([
        'void',
        'void-with-preamble',
    ])('Buffer %s.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'bad', `${name}.txt`));

        // when
        let result: any = null;
        let error: any = null;
        try {
            result = await sitemap2urllist(input);
        } catch (err) {
            error = err;
        }

        // then
        expect(result).toBeFalsy();
        expect(error).toBeTruthy();
    })
})