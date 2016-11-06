import 'source-map-support/register';
import handleErrors from './utils/error';
import config from './config';
import Mocha from './mocha';
import Watcher from './watcher';
import resetRequireCache from './utils/reset-cache';
import { instrument, report } from './istanbul';


async function main() {
  const { testFiles, sourceFiles, watcher, onChange } = await Watcher( config );
  const allFiles = sourceFiles.concat( testFiles );

  const mocha = await Mocha( {...config } );
  await mocha.init();

  async function run( {
    changedFiles = allFiles,
    sourceFiles: changedSourceFiles = sourceFiles,
    testFiles: changedTestFiles = testFiles
  } = {} ) {
    console.time( 'Total running time' );
    if (changedTestFiles.length) {
      await resetRequireCache( changedFiles );
      await instrument( { files: changedSourceFiles, changedFiles: changedSourceFiles, ...config } );
      await mocha.run( { files: changedTestFiles } );
    } else {
      await resetRequireCache( [...changedFiles, ...testFiles] );
      await instrument( { files: changedSourceFiles, changedFiles: changedSourceFiles, ...config } );
      await mocha.run( { files: testFiles } );
    }
    await report( {...config } );
    console.timeEnd( 'Total running time' );
  }

  await run();
  await onChange( { run } );
}

main().catch( handleErrors );
