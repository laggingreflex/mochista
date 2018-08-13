const Path = require('path');

const utils = exports;

utils.Error = class extends Error {};

utils.defer = class Defer {
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  get then () { return this.promise.then.bind(this.promise); }
  get catch () { return this.promise.catch.bind(this.promise); }
};

utils.resetRequireCache = (filesToDelete = [], { cwd = process.cwd() } = {}) => {
  filesToDelete = filesToDelete.map(f => Path.resolve(cwd, f));

  for (const cacheFile in require.cache) {
    if (filesToDelete.includes(cacheFile)) {
      // console.log('reset', cacheFile);
      delete require.cache[cacheFile];
    }
  }
};
