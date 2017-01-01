/* eslint-disable import/no-unassigned-import, import/no-commonjs, import/unambiguous, global-require, no-catch-shadow */

require('source-map-support/register');
require('require-up/register');

try {
  module.exports = require('./dist');
} catch (err) {
  console.error(err);
  console.error('Couldn\'t require "dist", trying "src"...');
  try {
    module.exports = require('./src');
  } catch (err) {
    console.error(err);
    console.error('Couldn\'t require "src" either. Try compiling or use with \'babel-register\' or `--harmony` flag');
  }
}
