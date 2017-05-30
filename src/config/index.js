import _ from 'lodash';
import yargs from 'yargs';
import getMochaOpts from './mocha-options';
import getNycOpts from './nyc-options';
import { printUsage } from '.../utils/help';
import defaults from './defaults';
import fix from './fix';
import merge from './merge';

let config = yargs.options(defaults).argv;
const mochaOpts = getMochaOpts();
const nycOpts = getNycOpts(config.root);
const argv = fix(yargs.options(defaults).parse(process.argv.slice(2)));
config = merge(config, mochaOpts, nycOpts, argv);
config = fix(config);

if (config.help) {
  printUsage(1);
}

export default config;
