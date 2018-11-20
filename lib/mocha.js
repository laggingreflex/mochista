const Mocha = require('mocha');
const camel = require('camelcase');
const { parent, child } = require('lib/utils/fork');
const utils = require('lib/utils');

if (module.parent) {
  module.exports = async (config, files) => {
    const mocha = await parent(__filename, { run: [] });
    try {
      return await mocha.run(config, files);
    } finally {
      await mocha.end();
    }
  };
} else {
  child({
    run: (argv, files) => new Promise((resolve, reject) => {
      const mocha = load(argv);
      mocha.files = files.testFiles;
      for (const require of argv.require) {
        utils.requireFromCwd(require);
      }
      if (argv.all) {
        for (const sourceFile of Array.from(files.sourceFiles || []).sort()) {
          utils.requireFromCwd(sourceFile);
        }
      }
      const runner = mocha.run();
      const failures = [];
      setTimeout(() => {
        if (!runner.total) resolve();
      }, 100);
      runner.on('fail', (test, error) => {
        failures.push(error);
      });
      runner.on('end', () => {
        resolve({ failures });
      });
    })
  });
}

function load(argv = {}) {
  const opts = getMochaOpts(argv);

  const mocha = new Mocha(opts);

  const ifn = c => f => c && f(c);
  const opt = new Proxy({}, { get: (_, o) => typeof o === 'string' && (opts[o] || argv[o]) });

  ifn(opt.colors)(c =>
    mocha.useColors(true));

  ifn(opt.noColors || opt.color === false)(c =>
    mocha.useColors(false));

  ifn(opt.inlineDiffs)(c =>
    mocha.useInlineDiffs(true));

  ifn(opt.slow)(c =>
    mocha.suite.slow(c));

  ifn(opt.timeout)(c =>
    mocha.suite.timeout(c));

  ifn(opt.noTimeouts)(c =>
    mocha.enableTimeouts(false));

  ifn(opt.bail || opt.b)(c =>
    mocha.suite.bail(true));

  ifn(opt.grep)(c =>
    mocha.grep(c));

  ifn(opt.fgrep)(c =>
    mocha.fgrep(c));

  ifn(opt.invert)(c =>
    mocha.invert());

  ifn(opt.checkLeaks)(c =>
    mocha.checkLeaks());

  ifn(opt.fullTrace)(c =>
    mocha.fullTrace());

  ifn(opt.growl)(c =>
    mocha.growl());

  ifn(opt.asyncOnly)(c =>
    mocha.asyncOnly());

  ifn(opt.delay)(c =>
    mocha.delay());

  ifn(opt.globals)(c =>
    mocha.globals(c));

  ifn(opt.retries)(c =>
    mocha.suit.retries(c));

  ifn(opt.ui)(c =>
    mocha.ui(c));

  return mocha;
}

function getMochaOpts(argv) {
  const opts = {};
  for (const opt in argv) {
    if (opt.startsWith('mocha-')) {
      opts[camel(opt.substr(6))] = argv[opt];
    } else if (opt.startsWith('mocha')) {
      opts[opt.charAt(5).toLowerCase() + opt.substr(6)] = argv[opt];
    }
  }
  return opts;
}
