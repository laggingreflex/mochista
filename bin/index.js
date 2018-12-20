#!/usr/bin/env node

require('dotenv').load();
const Path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const yargs = require('yargs');
const merge = require('merge-async-iterators');
const streamAsync = require('streams-to-async-iterator')
const options = require('./options');
const mochista = require('../lib');
const utils = require('../lib/utils');

const { argv: config } = yargs
  .scriptName(require('../package.json').name)
  .wrap(null)
  .options(options)
  .env('MOCHISTA')
  .pkgConf('mochista');

config.cwd = config.cwd || process.cwd();
config.coverageDir = utils.absOrRel(config.coverageDir, config.cwd);
config.coverageTempDir = config.coverageTempDir ? utils.absOrRel(config.coverageTempDir, config.cwd) : Path.join(config.coverageDir, '.tmp');
process.env.NODE_V8_COVERAGE = config.coverageTempDir;

config.config = utils.absOrRel(config.config, config.cwd);
if (fs.existsSync(config.config)) try {
  let userConfig = require(config.config);
  if (typeof userConfig === 'function') {
    userConfig = userConfig(config);
  }
  Object.assign(config, userConfig);
} catch (error) {
  throw new Error(`Couldn't read config file '${config.config}'. ${error.message}`);
}

main(config).catch(error => {
  process.exitCode = error.exitCode || 1;
  if (error instanceof utils.Error && !error.failures) {
    console.error(error.message);
  } else {
    if (!error.failures) {
      console.error(error);
    }
  }
});

async function main(config = {}) {

  const { watcher, run } = await mochista(config);
  const stdin = config.watch && streamAsync(process.stdin.setEncoding('utf8'));
  const merged = merge([watcher, stdin].filter(Boolean), { yieldIterator: true });

  let firstRun = true;

  for await (const { iterator } of merged) {
    try {
      if (
        firstRun
        || iterator === stdin
        || !(typeof config.watch === 'string' && config.watch.startsWith('i'))
      ) {
        try {
          await run();
        } finally {
          if (firstRun && config.coverageServer) {
            console.log('Running coverage live-server...');
            spawn('npx', ['live-server', config.coverageDir], { shell: true, stdio: ['ignore', 'pipe', 'inherit'] });
          }
          firstRun = false;
        }
      }
    } catch (error) {
      if (config.watch) {
        if (!error.failures) {
          console.error(error);
        }
      } else {
        throw error;
      }
    }
    if (config.watch) {
      process.stdout.write('Press Enter to re-run');
      process.stdout.cursorTo(0);
    } else {
      break;
    }
  }
}
