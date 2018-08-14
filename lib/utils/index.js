const Path = require('path');

const utils = exports;
const e = m => exports[m] = require('./' + m);

e('Defer');

utils.Error = class extends Error {};

utils.resetRequireCache = (filesToDelete = [], { cwd = process.cwd() } = {}) => {
  filesToDelete = filesToDelete.map(f => Path.resolve(cwd, f));

  for (const cacheFile in require.cache) {
    if (filesToDelete.includes(cacheFile)) {
      // console.log('reset', cacheFile);
      delete require.cache[cacheFile];
    }
  }
};
