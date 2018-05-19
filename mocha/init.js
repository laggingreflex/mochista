const Mocha = require('mocha');
const log = require('../utils/logger');

module.exports = function load (config) {
  const mocha = new Mocha(config);

  if (config.colors) {
    mocha.useColors(true);
  }
  if (config.noColors) {
    mocha.useColors(false);
  }
  if (config.inlineDiffs) {
    mocha.useInlineDiffs(true);
  }
  // if (config.slow) {
  //   mocha.suite.slow(config.slow);
  // }
  // if (config.timeout) {
  //   mocha.suite.timeout(config.timeout);
  // }
  // if (config.noTimeouts) {
  //   mocha.enableTimeouts(false);
  // }
  mocha.suite.bail(config.bail);
  // if ( config.grep ) {
  //   mocha.grep( config.grep );
  // }
  if (config.fgrep) {
    mocha.fgrep(config.fgrep);
  }
  if (config.invert) {
    mocha.invert();
  }
  if (config.checkLeaks) {
    mocha.checkLeaks();
  }
  // if ( config.fullTrace ) {
  //   mocha.fullTrace();
  // }
  if (config.growl) {
    mocha.growl();
  }
  if (config.asyncOnly) {
    mocha.asyncOnly();
  }
  if (config.delay) {
    mocha.delay();
  }
  if (config.globals) {
    mocha.globals(config.globals);
  }
  // if ( config.retries ) {
  //   mocha.suite.retries( config.retries );
  // }
  // mocha.ui( config.ui );
  return mocha;
};
