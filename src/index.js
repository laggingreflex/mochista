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
  const {
    watcher,
    onChange,
    initialAllFiles,
    initialTestFiles,
    initialSourceFiles,
  } = await Watcher(config);

  const mocha = await Mocha({...config });
  await mocha.load();
  await instrument({ files: initialSourceFiles, ...config });

  async function run({
    allFiles = initialAllFiles,
    changedFiles = initialAllFiles,
    testFiles = initialTestFiles,
    changedTestFiles = initialTestFiles,
    sourceFiles = initialSourceFiles,
    changedSourceFiles = initialSourceFiles,
  } = {}) {
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
