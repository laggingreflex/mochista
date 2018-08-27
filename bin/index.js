#!/usr/bin/env node

require('dotenv').load();
const yargs = require('yargs');
const merge = require('merge-async-iterators');
const streamAsync = require('streams-to-async-iterator')
const options = require('./options');
const mochista = require('..');
const utils = require('../lib/utils');

const argv = yargs
  .scriptName(require('../package.json').name)
  .wrap(null)
  .options(options)
  .env()
  .argv;

main(argv).catch(error => {
  process.exitCode = error.exitCode || 1;
  if (error instanceof utils.Error && !error.failures) {
    console.error(error.message);
  } else {
    if (!error.failures) {
      console.error(error);
    }
  }
});

async function main(argv = {}) {

  const { watcher, run } = await mochista(argv);
  const stdin = argv.watch && streamAsync(process.stdin.setEncoding('utf8'));
  const merged = merge([watcher, stdin].filter(Boolean), { yieldIterator: true });

  let firstRun = true;

  for await (const { iterator } of merged) {
    try {
      if (
        firstRun
        || iterator === stdin
        || !(typeof argv.watch === 'string' && argv.watch.startsWith('i'))
      ) {
        firstRun = false;
        await run();
      }
    } catch (error) {
      if (argv.watch) {
        if (!error.failures) {
          console.error(error);
        }
      } else {
        throw error;
      }
    }
    if (argv.watch) {
      process.stdout.write('Press Enter to re-run');
      process.stdout.cursorTo(0);
    } else {
      break;
    }
  }
}
