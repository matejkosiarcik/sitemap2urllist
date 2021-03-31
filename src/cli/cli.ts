import * as process from 'process';
import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import { URL, pathToFileURL } from 'url';
import { sitemap2urllist } from '../lib/lib';

// parse arguments
const argv = yargs
  .help(true)
  .option('help', { alias: 'h', describe: 'Show usage', type: 'boolean' })
  .version(false)
  .option('version', { alias: 'V', describe: 'Show current version', type: 'boolean' })
  .option('file', {
    alias: 'f', describe: 'Input file path (- for stdin) or http(s) address', type: 'string', default: '-', required: true,
  })
  .option('output', {
    alias: 'o', describe: 'Output file path (- for stdout)', type: 'string', default: '-', required: true,
  })
  .parse();

// print current version
if (argv.version) {
  const rootDirectory = path.dirname(path.dirname(path.dirname(__filename)));
  const { version } = require(path.join(rootDirectory, 'package.json'));  // eslint-disable-line
  console.log(`sitemap2urlllist v${version}`);
  process.exit(0);
}

// main work
(async () => {
  // read input
  let input: string | URL;
  if (argv.file === '-') {
    input = fs.readFileSync(process.stdin.fd, 'utf-8');
  } else if (argv.file.startsWith('https://') || argv.file.startsWith('http://') || argv.file.startsWith('file://')) {
    input = new URL(argv.file);
  } else {
    console.assert(fs.existsSync(argv.file), `Input file ${argv.file} does not exist`);
    input = pathToFileURL(argv.file);
  }

  // get the output
  let output: string;
  try {
    output = await sitemap2urllist(input);
  } catch (error) {
    console.log(error);
    process.exit(2);
  }

  // write output
  if (argv.output === '-') {
    fs.writeFileSync(process.stdout.fd, output);
  } else {
    console.assert(fs.existsSync(path.dirname(argv.output)), `Output file directory ${path.dirname(argv.output)}   does not exist`);
    fs.writeFileSync(argv.output, output);
  }
})();
