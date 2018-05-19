const fs = require('fs');
const yargs = require('yargs');
const defaults = require('./defaults');
const fix = require('./fix');

const args = process.argv;

module.exports = function getOptions () {
  let opts, optsPath = args.indexOf('--opts') > -1 && args[args.indexOf('--opts') + 1];

  if (optsPath) {
    try {
      opts = fs.readFileSync(optsPath, 'utf8');
    } catch (err) {
      err.message = `Couldn't read --opts file: ${optsPath}. ` + err.message;
      throw err;
    }
  } else {
    const optsTryPaths = ['mocha.opts', 'test/mocha.opts', 'tests/mocha.opts'];
    for (const path of optsTryPaths) {
      if (!opts) {
        try {
          opts = fs.readFileSync(path, 'utf8');
          optsPath = path;
        } catch (err) {}
      }
    }
  }

  if (!opts) return {};

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
    const config = fix(yargs.options(defaults).parse(opts));
    return config;
  } catch (err) {
    err.message = `Couldn't correctly parse --opts from the file: ${optsPath}. ` + err.message;
    throw err;
  }
};
