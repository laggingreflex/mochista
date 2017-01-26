import { spawn } from 'child_process';
import config from './config';
import log from './utils/logger';
import handleErrors from './utils/error';
import mochista from '.';
import { resetEntireRequireCache } from './utils/reset-cache';

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

  const { run } = await mochista(config);

  const keyPressLog = () => log('Press \'r\' to re-run all tests (\'a\' to reset entire cache)');

  await run();

  if (config.watch) {
    keyPressLog();
    process.stdin.on('readable', onKeypress);
  } else {
    process.exit(0);
  }

  async function onKeypress() {
    const input = process.stdin.read();
    if (!input) {
      return;
    }
    log.verb('You entered:', JSON.stringify(input));
    if (!(input === 'r' || 'a' === input)) {
      return;
    }
    if ('a' === input) {
      resetEntireRequireCache();
    }
    try {
      await run();
      keyPressLog();
    } catch (err) {
      console.error(err);
    }
  }
}

main().catch(handleErrors);
