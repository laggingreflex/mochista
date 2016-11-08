import 'source-map-support/register';
import 'require-up/register';
import config from '.../config';
import handleErrors from '.../utils/error';
import Mocha from './mocha';
import Watcher from './watcher';
import resetRequireCache from '.../utils/reset-cache';
import log from '.../utils/logger';
import { instrument, report } from './istanbul';


async function main() {
  const { testFiles, sourceFiles, watcher, onChange } = await Watcher( config );
  const allFiles = sourceFiles.concat( testFiles );

  const mocha = await Mocha( {...config } );
  await mocha.load();

  async function run( {
    changedFiles = allFiles,
    sourceFiles: changedSourceFiles = sourceFiles,
    testFiles: changedTestFiles = testFiles
  } = {} ) {
    log.time('Total run time');
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
    log.timeEnd('Total run time', 'info');
  }

  await run();
  await onChange( { run } );
}

main().catch( handleErrors );
