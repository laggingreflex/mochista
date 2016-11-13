import 'source-map-support/register';
import 'require-up/register';
import config from '.../config';
import handleErrors from '.../utils/error';
import Mocha from './mocha';
import Watcher from './watcher';
import initGlobs from './watcher/glob';
import resetRequireCache from '.../utils/reset-cache';
import log from '.../utils/logger';
import { instrument, report } from './istanbul';


async function main() {
  const { testFiles, sourceFiles } = await initGlobs(config);
  const allFiles = sourceFiles.concat(testFiles);
  const { watcher, onChange } = await Watcher(config);

  const mocha = await Mocha({...config });
  await mocha.load();
  await instrument({ files: sourceFiles, ...config });

  async function run({
    changedFiles = allFiles,
    sourceFiles: changedSourceFiles = sourceFiles,
    testFiles: changedTestFiles = testFiles
  } = {}) {
    // log.debug({ changedFiles, changedSourceFiles, changedTestFiles });
    try {
      log.time('Total run time');
      if (changedTestFiles.length && !config.all) {
        await resetRequireCache(changedFiles);
        await mocha.run({ files: changedTestFiles });
      } else {
        await resetRequireCache([...changedFiles, ...testFiles]);
        await mocha.run({ files: testFiles });
      }
      await report({...config });
      log.timeEnd('Total run time', 'info');
    } catch (err) {
      if (config.watch) {
        log.err(err);
      } else {
        throw err;
      }
    }
    if (config.watch) {
      log('Waiting...');
    }
  }

  await run();
  if (config.watch) {
    await onChange({ run });
  }
}

main().catch(handleErrors);
