const watch = require('./watch');
const mocha = require('./mocha');
const cover = require('./cover');

module.exports = async (config = {}) => {
  let files;
  const watcher = (async function*() {
    for await (const _files of watch(config)) {
      files = _files;
      yield files
    }
  })();
  const run = async () => {
    const { failures } = await mocha(config, files);
    if (failures && failures.length) {
      const error = new Error(`${failures.length} failed`);
      error.failures = failures;
      throw error;
    }
    cover(config, files);
  };
  return { watcher, run };
};
