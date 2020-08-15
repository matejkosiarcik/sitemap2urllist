import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'
import * as yargs from 'yargs'
import { sitemap2urllist } from 'sitemap2urllist'
import { assert } from 'console'

// parse arguments
const argv = yargs
    .help(true)
    .option('help', { alias: 'h', describe: 'Show usage', type: 'boolean' })
    .version(false)
    .option('version', { alias: 'V', describe: 'Show current version', type: 'boolean' })
    .option('file', { alias: 'f', describe: 'Input file path', type: 'string', default: '-', required: true })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string', default: '-', required: true })
    .parse()
if (argv.version) {
    console.log('sitemap2urlllist v0.0.0')
    process.exit()
}

// read input
let inputXml: string
if (argv.file === '-') {
    inputXml = fs.readFileSync(process.stdin.fd, 'utf-8')
} else {
    assert(fs.existsSync(argv.file), 'Input file does not exist')
    inputXml = fs.readFileSync(argv.file, 'utf-8')
}

// get the output
let outputList: string
try {
    outputList = sitemap2urllist(inputXml)
} catch (error) {
    console.log(error)
    process.exit(2)
}

// write output
if (argv.output === '-') {
    fs.writeFileSync(process.stdout.fd, outputList)
} else {
    assert(fs.existsSync(path.dirname(argv.file)), 'Output file directory does not exist')
    fs.writeFileSync(argv.output, outputList)
}
