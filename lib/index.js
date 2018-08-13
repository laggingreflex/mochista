const watch = require('./watch');
const mocha = require('./mocha');
const cover = require('./cover');
const utils = require('./utils');

module.exports = (argv = {}) => {

  let files;
  let combined;
  const combine = () => files.entriesArray()
    .map(([key, files]) => files.toArray().map(_ => ({ ..._, key })))
    .reduce((a, b) => a.concat(b));

  let firstTime = true;

  const coverage = cover(argv);

  const run = async (opts = {}) => {
    const sourceChanged = Boolean(files.get(argv.sourceFiles).toArray().find(_ => _.changed));
    const resetFiles = combined
      .filter(_ => _.changed || sourceChanged || opts.all)
      .map(_ => _.file);

    const testFiles = files.get(argv.testFiles).toArray()
      .filter(_ => _.changed || sourceChanged || opts.all)
      .map(_ => _.file);

    utils.resetRequireCache(resetFiles);

    if (opts.coverage !== false && argv.coverage) {
      let error;
      await coverage(async () => {
        try {
          await mocha(testFiles);
        } catch (e) {
          error = e;
        }
      });
      if (error) throw error;
    } else {
      await mocha(testFiles);
    }
  };

  const watcher = (async function*() {
    const watcher = watch(argv);
    for await (const _files of watcher) {
      files = _files;
      combined = combine();
      // console.log('before');
      try {
        yield files
      } catch (error) {
        watcher.throw(error);
        throw error;
      }
      // console.log('after');
      if (firstTime) firstTime = false;
    }
  })();

  // console.log(`watcher:`, watcher);
  // console.log(`watcher.throw:`, watcher.throw);

  return { watcher, run };
};
