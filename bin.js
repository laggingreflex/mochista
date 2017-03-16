#!/usr/bin/env node

/* eslint-disable import/no-unassigned-import, import/no-commonjs, import/unambiguous, global-require, no-catch-shadow */

require('source-map-support/register');
require('require-up/register');
try { require('babel-polyfill'); } catch (noop) {}

try {
  module.exports = require('./dist/bin');
} catch (err) {
  console.error(err);
  console.error('Couldn\'t require "dist/bin", trying "src/bin"...');
  try {
    module.exports = require('./src/bin');
  } catch (err) {
    console.error(err);
    console.error('Couldn\'t require "src" either. Try compiling or use with \'babel-register\' or `--harmony` flag');
  }
}
