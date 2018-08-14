const Map = require('map-better');
const watch = require('file-watch-iterator');
const merge = require('merge-async-iterators');
// const merge = require('mergeiterator');
const utils = require('./utils')

module.exports = async function*(argv = {}) {

  const files = new Map([
    [argv.testFiles],
    [argv.sourceFiles]
  ]);

  const exclude = files.map((_, files) => [...argv.exclude, ...files === argv.sourceFiles ? argv.testFiles : []]);

  const interrupt = new utils.Defer();

  const watchers = files.map((_, files) => {
    const paths = Array.from(files);
    const ignored = exclude.get(files);
    return watch(paths, {
      cwd: argv.cwd,
      ignored,
      // awaitWriteFinish: argv.awaitWriteFinish !== false,
    }, {
      interrupt: Promise.race([interrupt, argv.interrupt].filter(Boolean)),
    })
  });

  const ready = files.map(i => false);
  const isReady = () => !ready.hasValue(false);

  const merged = mergeWatchers(watchers);
  for await (const { watcher, changed } of merged) {

    outer: for (const file in changed.files) {
      for (const extension of argv.extensions) {
        if (file.endsWith(extension)) {
          continue outer;
        }
      }
      delete changed.files[file];
    }

    const key = watchers.getKey(watcher);

    files.set(key, changed);

    if (!isReady()) {
      ready.set(key, true);
      if (!isReady()) {
        continue;
      }
    }

    try {
      yield files;
    } catch (error) {
      merged.throw(error);
      interrupt.reject(error);
      throw error;
    }
  }
};

async function* mergeWatchers(watchers) {
  const merged = merge(watchers.valuesArray(), { yieldIterator: true });
  for await (const { iterator: watcher, data: { value: changed } } of merged) {
    try {
      yield { watcher, changed };
    } catch (error) {
      merged.throw(error)
      throw error;
    }
  }
}
