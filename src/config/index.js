import _ from 'lodash';
import yargs from 'yargs';
import getMochaOpts from './mocha-options';
import { printUsage } from '.../utils/help';
import defaults from './defaults';
import fix from './fix';
import merge from './merge';

let config = yargs.options(defaults);
const mochaOpts = getMochaOpts();
const argv = fix(yargs.options(defaults).parse(process.argv.slice(2)));
config = merge(config, mochaOpts, argv);
config = fix(config);

if (config.help) {
  printUsage(1);
}

export default config;
