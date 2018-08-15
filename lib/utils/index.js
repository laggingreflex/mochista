const Path = require('path');
const fs = require('fs');
const untildify = require('untildify');

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

utils.flat = require('array.prototype.flat');
utils.arrify = require('arrify');

utils.readFile = _ => {
  try {
    return fs.readFileSync(untildify(_), 'utf8');
  } catch (error) {
    return ''
  }
}
