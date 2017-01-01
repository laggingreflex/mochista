import { spawn } from 'child_process';
import config from './config';
import log from './utils/logger';
import handleErrors from './utils/error';
import mochista from '.';

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

  const { run, onChange } = await mochista(config);

  await run();

  if (!config.watch) {
    process.exit(0);
    return;
  }

  await onChange({ run });
  process.stdin.on('readable', async() => {
    const input = process.stdin.read();
    if (!input) {
      return;
    }
    log.verb('You entered:', JSON.stringify(input));
    if (!(input === 'r' || 'a' === input)) {
      return;
    }
    try {
      await run();
    } catch (err) {
      console.error(err);
    }
  });
}

main().catch(handleErrors);
