const Mocha = require('mocha');
const utils = require('./utils');

module.exports = async (files, argv) => {
  const mocha = load(argv);
  mocha.files = files;

  // await promisify(mocha.run.bind(mocha))();

  await new Promise((resolve, reject) => {
    const runner = mocha.run();
    const failures = [];
    runner.on('end', () => {
      // console.log(';end');
      // console.log(`failures:`, failures);
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

  return mocha;
};

function load (argv = {}) {
  const mocha = new Mocha(argv);

  if (argv.colors) {
    mocha.useColors(true);
  }
  if (argv.noColors) {
    mocha.useColors(false);
  }
  if (argv.inlineDiffs) {
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
  mocha.suite.bail(argv.bail);
  // if ( config.grep ) {
  //   mocha.grep( config.grep );
  // }
  if (argv.fgrep) {
    mocha.fgrep(argv.fgrep);
  }
  if (argv.invert) {
    mocha.invert();
  }
  if (argv.checkLeaks) {
    mocha.checkLeaks();
  }
  // if ( config.fullTrace ) {
  //   mocha.fullTrace();
  // }
  if (argv.growl) {
    mocha.growl();
  }
  if (argv.asyncOnly) {
    mocha.asyncOnly();
  }
  if (argv.delay) {
    mocha.delay();
  }
  if (argv.globals) {
    mocha.globals(argv.globals);
  }
  // if ( config.retries ) {
  //   mocha.suite.retries( config.retries );
  // }
  // mocha.ui( config.ui );
  return mocha;
}
