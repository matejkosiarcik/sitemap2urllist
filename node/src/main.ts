import * as yargs from 'yargs';
import 'isomorphic-fetch';
import { convert, save, version } from './lib';

// parse arguments
const args = yargs
  .help(true)
  .option('help', { alias: 'h', describe: 'Show usage', type: 'boolean' })
  .version(false)
  .option('version', { alias: 'V', describe: 'Show current version', type: 'boolean' })
  .option('file', {
    alias: 'f', describe: 'Input path or URL for sitemap (- for stdin)', type: 'string', default: '-', required: true,
  })
  .option('output', {
    alias: 'o', describe: 'Output path for urllist (- for stdout)', type: 'string', default: '-', required: true,
  })
  .option('alternate', {
    describe: 'Include alternate links', type: 'boolean', default: false,
  })
  .strict()
  .parseSync();

// print current version
if (args.version) {
  console.log(`sitemap2urllist ${version()}`);
  process.exit(0);
}

// main work
(async () => {
  let urls = await convert(args.file, args.alternate);
  save(args.output, urls);
})();
