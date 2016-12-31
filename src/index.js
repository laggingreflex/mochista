import 'source-map-support/register';
import 'require-up/register';
import { spawn } from 'child_process';
import config from '.../config';
import handleErrors from '.../utils/error';
import Mocha from './mocha';
import Watcher from './watcher';
import resetRequireCache from '.../utils/reset-cache';
import log from '.../utils/logger';
import { instrument, report } from './istanbul';

// import keypress from 'keypress';

// Promise.config({ cancellation: true });
// global.Promise = Promise;

process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);

async function main() {
  if (config.bs) {
    const [cmd, ...args] = `browser-sync start --server ${config.reportDir}/lcov-report --files ${config.reportDir}/lcov-report/**/*.html`
    .split(/[\s]+/g);
    spawn(cmd, args, {
      stdio: 'inherit',
      shell: true
    });
    return;
  }

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
      running = false;
    }
  }

  await run();
  if (config.watch) {
    await onChange({ run });
    process.stdin.on('readable', () => {
      const input = process.stdin.read();
      if (!input) {
        return;
      }
      log.verb('You entered:', JSON.stringify(input));
      if (running) {
        log.verb('A previous version is already running');
        return;
      }
      if (input === 'r' || 'a' === input) {
        run();
      }
    });
  }
}

main().catch(handleErrors);
