import yargs from 'yargs';
import getOptions from 'mocha/bin/options';
import { printUsage } from '../utils/help';
import { separateBangExcludes } from '../utils/excludes';
import defaults from './defaults';
import checkTestExcludes from './check-test-excludes';

getOptions();
yargs.parse( process.argv );

const { argv: config } = yargs.options( defaults );

if ( config.help ) {
  printUsage( 1 );
}

config._.shift();
config._.shift();

if ( config._.length > 1 ) {
  config.testFiles = config._;
}

const { includes: testFiles, excludes: testFilesExclude } = separateBangExcludes( config.testFiles );
config.testFiles = testFiles;
config.testFilesExclude.push( ...testFilesExclude );

const { includes: sourceFiles, excludes: sourceFilesExclude } = separateBangExcludes( config.sourceFiles );
config.sourceFiles = sourceFiles;
config.sourceFilesExclude.push( ...sourceFilesExclude );

// console.log( config );
// console.log( { testFiles: config.testFiles } );
// console.log( { testFilesExclude: config.testFilesExclude } );
// console.log( { sourceFiles: config.sourceFiles } );
// console.log( { sourceFilesExclude: config.sourceFilesExclude } );

checkTestExcludes(config);

export default config;
