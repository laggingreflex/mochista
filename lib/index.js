const watch = require('./watch');
const mocha = require('./mocha');
const cover = require('./cover');

module.exports = async (argv = {}) => {
  let files;
  const watcher = (async function*() {
    for await (const _files of watch(argv)) {
      files = _files;
      yield files
    }
  })();
  const run = async () => {
    const { failures } = await mocha(argv, files);
    if (failures && failures.length) {
      const error = new Error(`${failures.length} failed`);
      error.failures = failures;
      throw error;
    }
    cover(argv);
  };
  return { watcher, run };
};
