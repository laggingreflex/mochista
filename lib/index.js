const watch = require('./watch');
const mocha = require('./mocha');
const cover = require('./cover');
const utils = require('./utils');

module.exports = (argv = {}) => {

  let files;

  const runMocha = mocha(argv);
  const runCoverage = cover(argv);

  const run = async (runOpts = {}) => {
    const opts = { ...argv, ...runOpts };

    utils.resetRequireCache(files.filesToReset);

    if (opts.coverage) {
      let error;
      const console = opts.coverageFirst && utils.bufferConsole();
      await runCoverage(async () => {
        try {
          await runMocha(files.testFiles);
        } catch (e) {
          error = e;
        }
        console && console.resume();
      });
      console && console.replay();
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
