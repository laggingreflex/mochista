const watch = require('./watch');
const mocha = require('./mocha');
const cover = require('./cover');
const utils = require('./utils');

module.exports = (argv = {}) => {

  let files;

  const runMocha = mocha(argv);
  const runCoverage = cover(argv);

  for (const require of argv.require) {
    utils.requireFromCwd(require);
  }

  const run = async (runOpts = {}) => {
    const opts = { ...argv, ...runOpts };

    utils.resetRequireCache(files.allFiles);

    if (opts.coverage) {
      let error;
      const interceptStdout = utils.interceptStdout(opts.coverageFirst);
      interceptStdout.next();
      await runCoverage(async () => {
        try {
          if (opts.all) {
            for (const sourceFile of files.sourceFiles) {
              utils.requireFromCwd(sourceFile);
            }
          }
          await runMocha(files.testFiles);
        } catch (e) {
          error = e;
        }
        interceptStdout.next();
      });
      interceptStdout.next();
      if (error) throw error;
    } else {
      await runMocha(files.testFiles);
    }
  };

  const watcher = (async function*() {
    for await (const _files of watch(argv)) {
      files = _files;
      yield files
    }
  })();

  return { watcher, run };
};
