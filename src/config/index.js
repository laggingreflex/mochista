import yargs from 'yargs';
import getOptions from './mocha-options';
import { printUsage } from '.../utils/help';
import { separateBangExcludes } from '.../utils/excludes';
import defaults from './defaults';
import checkTestExcludes from './check-test-excludes';

const mochaOpts = getOptions();
const config = yargs.options(defaults).parse(mochaOpts || process.argv.slice(2));

if ( config.help ) {
  printUsage( 1 );
}

if ( config._.length >= 1 ) {
  config.testFiles = config._;
}

const { includes: testFiles, excludes: testFilesExclude } = separateBangExcludes( config.testFiles );
config.testFiles = testFiles;
config.testFilesExclude.push( ...testFilesExclude );

const { includes: sourceFiles, excludes: sourceFilesExclude } = separateBangExcludes( config.sourceFiles );
config.sourceFiles = sourceFiles;
config.sourceFilesExclude.push( ...sourceFilesExclude );

checkTestExcludes( config );

export default config;
