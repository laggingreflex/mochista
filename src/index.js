import Path from 'path';
import { defaults } from './config/defaults';
import Mocha from './mocha';
import Watcher from './watcher';
import resetRequireCache, { resetEntireRequireCache } from '.../utils/reset-cache';
import log, { config as configLogger } from '.../utils/logger';
import { instrument, report } from './istanbul';

export default async function mochista(configArg) {
  const config = { ...defaults, ...configArg };
  configLogger(config);

  const {
    watcher,
    onChange,
    initialAllFiles,
    initialTestFiles,
    initialSourceFiles,
  } = await Watcher(config);

  const mocha = await Mocha({ ...config });
  await mocha.load();

  if (config.instrument !== false) {
    await instrument({ files: initialSourceFiles, ...config });
  }

  let running = false;
  let firstTime = true;

  async function run({
    allFiles = initialAllFiles,
    changedFiles = initialAllFiles,
    testFiles = initialTestFiles,
    changedTestFiles = initialTestFiles,
    sourceFiles = initialSourceFiles,
    changedSourceFiles = initialSourceFiles,
  } = {}) {
    if (running) {
      log.verbose('A previous version is already running');
      return;
    }
    running = true;
    try {
      log.time('Total run time');
      if (changedTestFiles.length && !config.runAll) {
        if (config.runAll) {
          await resetEntireRequireCache(changedFiles);
        } else {
          await resetRequireCache(changedFiles);
        }
        await mocha.run({ files: changedTestFiles });
      } else {
        await resetRequireCache(allFiles);
        await mocha.run({ files: testFiles });
      }
      if (config.all) {
        initialSourceFiles.forEach(file => {
          log.verbose(`Requiring file: `, file);
          require(Path.join(config.root, file));
        });
      }
      await report({ ...config, sourceFiles });
      log.timeEnd('Total run time', 'info');
    } catch (err) {
      if (config.watch) {
        log.error(err);
      } else {
        throw err;
      }
    }
    if (config.watch) {
      log('Waiting for file changes...');
      // todo: attach keypress message for file changes here
    }

    running = false;

    if (firstTime) {
      firstTime = false;
      if (config.watch) {
        onChange({ run });
        // todo: should this halt/await forever? context: start-mochista
      }
    }
  }

  return { watcher, mocha, onChange, run };
}
