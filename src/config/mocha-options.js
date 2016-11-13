import { readFileSync } from 'fs';

const args = process.argv;

export default function getOptions() {
  let opts, optsPath = args.indexOf('--opts') > -1 && args[args.indexOf('--opts') + 1];

  if (optsPath) try {
    opts = readFileSync(optsPath, 'utf8');
  } catch (err) {
    err.message = `Couldn't read --opts file: ${optsPath}. ` + err.message;
    throw err;
  } else {
    const optsTryPaths = ['mocha.opts', 'test/mocha.opts', 'tests/mocha.opts'];
    for (const path of optsTryPaths)
      if (!opts) try {
        opts = readFileSync(path, 'utf8');
        optsPath = path;
      } catch (err) {}
  }

  if (!opts) return;

  try {
    if (opts.match(/[\n\r]/)) {
      // multiline options
      opts = opts.split(/[\n\r]+/);
      opts = opts.filter(arg => arg.charAt(0) !== '#');
      opts = opts.reduce((opts, line) => opts.concat(line.split(/[\s]+/)), []);
    } else {
      opts = opts.split(/\s/);
    }
    opts = opts.filter(Boolean);
    opts = opts.map(value => value.replace(/%20/g, ' '));
    process.env.LOADED_MOCHA_OPTS = true;
    return opts;
  } catch (err) {
    err.message = `Couldn't correctly parse --opts from the file: ${optsPath}. ` + err.message;
    throw err;
  }
}
