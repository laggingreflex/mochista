import { defaults } from './config/defaults';
import Mocha from './mocha';
import Watcher from './watcher';
import resetRequireCache from '.../utils/reset-cache';
import log from '.../utils/logger';
import { instrument, report } from './istanbul';

export default async function main(config = defaults) {
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

  let running = false;

  async function run({
    allFiles = initialAllFiles,
    changedFiles = initialAllFiles,
    testFiles = initialTestFiles,
    changedTestFiles = initialTestFiles,
    sourceFiles = initialSourceFiles,
    changedSourceFiles = initialSourceFiles,
  } = {}) {
    if (running) {
      log.verb('A previous version is already running');
      return;
    }
    running = true;
    try {
      log.time('Total run time');
      if (changedTestFiles.length && !config.all) {
        await resetRequireCache(changedFiles);
        await mocha.run({ files: changedTestFiles });
      } else {
        await resetRequireCache(allFiles);
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
      log('Waiting for file changes...');
      log('Press \'r\' (or \'a\') to re-run all tests');
    }
    running = false;
  }

  return { run, onChange };
}
