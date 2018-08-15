const Mocha = require('mocha');
const utils = require('./utils');

module.exports = argv => files => new Promise((resolve, reject) => {
  const mocha = load(argv);
  mocha.files = files;
  const runner = mocha.run();
  const failures = [];
  runner.on('end', () => {
    if (failures.length) {
      const error = new utils.Error(`${failures.length} failed`);
      error.failures = failures;
      reject(error);
    } else {
      resolve();
    }
  });
  runner.on('fail', (test, error) => {
    failures.push(error);
  });
});

function load(argv = {}) {
  const opts = getMochaOpts(argv);

  const mocha = new Mocha(opts);

  if (opts.colors) {
    mocha.useColors(true);
  }
  if (opts.noColors) {
    mocha.useColors(false);
  }
  if (opts.inlineDiffs) {
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
  mocha.suite.bail(opts.bail);
  // if ( config.grep ) {
  //   mocha.grep( config.grep );
  // }
  if (opts.fgrep) {
    mocha.fgrep(opts.fgrep);
  }
  if (opts.invert) {
    mocha.invert();
  }
  if (opts.checkLeaks) {
    mocha.checkLeaks();
  }
  // if ( config.fullTrace ) {
  //   mocha.fullTrace();
  // }
  if (opts.growl) {
    mocha.growl();
  }
  if (opts.asyncOnly) {
    mocha.asyncOnly();
  }
  if (opts.delay) {
    mocha.delay();
  }
  if (opts.globals) {
    mocha.globals(opts.globals);
  }
  // if ( config.retries ) {
  //   mocha.suite.retries( config.retries );
  // }
  // mocha.ui( config.ui );
  return mocha;
}

function getMochaOpts(argv) {
  const opts = {};
  for (const opt in argv) {
    if (opt.startsWith('mocha-')) {
      opts[opt.substr(6)] = argv[opt];
    } else if (opt.startsWith('mocha')) {
      opts[opt.charAt(5).toLowerCase() + opt.substr(6)] = argv[opt];
    }
  }
  return opts;
}
