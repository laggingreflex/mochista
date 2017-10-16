#!/usr/bin/env node

const { spawn } = require('child_process');
const config = require('./config');
const log = require('./utils/logger');
const handleErrors = require('./utils/error');
const mochista = require('.');
const { resetEntireRequireCache } = require('./utils/reset-cache');

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

    log.verbose(`You entered: ${input} (${JSON.stringify(input)})`);

    const restart = async() => {
      try {
        await run();
        keyPressLog();
      } catch (err) {
        console.error(err);
      }
    };

    const exit = () => {
      log.verbose('Exiting');
      process.exit(0);
    };

    const inputMapFns = {
      r: restart,
      a: () => {
        resetEntireRequireCache();
        restart();
      },
      q: exit,
      '♥': exit,
      '\\u0003': exit,
      '"\\u0003"': exit,
    };

    if (inputMapFns[input]) {
      inputMapFns[input]()
    } else if (inputMapFns[JSON.stringify(input)]) {
      inputMapFns[JSON.stringify(input)]()
    } else {
      log.silly('Nothing to do for that input');
    }
  }
}

main().catch(handleErrors);

require('update-notifier')({ pkg: require('./package.json') }).notify();
