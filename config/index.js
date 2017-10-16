const _ = require('lodash');
const yargs = require('yargs');
const getMochaOpts = require('./mocha-options');
const { printUsage } = require('.../utils/help');
const defaults = require('./defaults');
const fix = require('./fix');
const merge = require('./merge');

let config = yargs.options(defaults).argv;
const mochaOpts = getMochaOpts();
const argv = fix(yargs.options(defaults).parse(process.argv.slice(2)));
config = merge(config, mochaOpts, argv);
config = fix(config);

if (config.help) {
  printUsage(1);
}

export default config;
