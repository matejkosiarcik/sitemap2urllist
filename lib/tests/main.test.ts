import { sitemap2urllist, sitemap2urllistFiles } from '../src/main'
import * as path from 'path'
import * as fs from 'fs'

const projectPath = path.join(__dirname, '..', '..')

describe('Test good inputs', () => {
    test.each([
        'zero',
        'single',
        'multiple',
        // 'alternative',
        // 'order-alphanum',
        // 'order-priority',
    ])('String sitemaps/%s-in.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-in.xml`)).toString()
        const output = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-out.txt`)).toString()

        // when
        const result = sitemap2urllist(input)

        // then
        expect(result).toBe(output)
    })

    test.each([
        'zero',
        'single',
        'multiple',
        // 'alternative',
        // 'order-alphanum',
        // 'order-priority',
    ])('Buffer %s-in.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-in.xml`))
        const output = fs.readFileSync(path.join(projectPath, 'sitemaps', 'good', `${name}-out.txt`)).toString()

        // when
        const result = sitemap2urllist(input)

        // then
        expect(result).toBe(output)
    })

    test.each([
        'zero',
        'single',
        'multiple',
        // 'alternative',
        // 'order-alphanum',
        // 'order-priority',
    ])('Filepath %s-in.xml', async (name) => {
        // given
        const tmpDir = fs.mkdtempSync('tmp')
        const inputPath = path.join(projectPath, 'sitemaps', 'good', `${name}-in.xml`)
        const outputPath = path.join(projectPath, 'sitemaps', 'good', `${name}-out.txt`)

        // when
        const resultPath = path.join(tmpDir, 'urllist.txt')
        sitemap2urllistFiles(inputPath, resultPath)

        // then
        expect(fs.readFileSync(resultPath).toString()).toBe(fs.readFileSync(outputPath).toString())
        fs.rmdirSync(tmpDir, { recursive: true })
    })
})

describe('Test bad inputs', () => {
    test.each([
        'void',
        'void-almost',
    ])('String sitemaps/%s.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'bad', `${name}.xml`)).toString()

        // when
        let result: any = null
        let error: any = null
        try {
            result = sitemap2urllist(input)
        } catch (err) {
            error = err
        }

        // then
        expect(result).toBeFalsy()
        expect(error).toBeTruthy()
    })

    test.each([
        'void',
        'void-almost',
    ])('Buffer %s.xml', async (name) => {
        // given
        const input = fs.readFileSync(path.join(projectPath, 'sitemaps', 'bad', `${name}.xml`))

        // when
        let result: any = null
        let error: any = null
        try {
            result = sitemap2urllist(input)
        } catch (err) {
            error = err
        }

        // then
        expect(result).toBeFalsy()
        expect(error).toBeTruthy()
    })

    test.each([
        'void',
        'void-almost',
    ])('Filepath %s.xml', async (name) => {
        // given
        const tmpDir = fs.mkdtempSync('tmp')
        const inputPath = path.join(projectPath, 'sitemaps', 'bad', `${name}.xml`)

        // when
        const resultPath = path.join(tmpDir, 'urllist.txt')

        // when
        let error: any = null
        try {
            sitemap2urllistFiles(inputPath, resultPath)
        } catch (err) {
            error = err
        }

        // then
        expect(error).toBeTruthy()
        expect(fs.existsSync(resultPath)).toBeFalsy()
        fs.rmdirSync(tmpDir, { recursive: true })
    })
})
