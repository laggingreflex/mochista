const Path = require('path');
const fs = require('fs');
const intercept = require('intercept-stdout');
const untildify = require('untildify');
const requireFromCwd = require('import-cwd')

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
utils.requireFromCwd = (file, cwd = process.cwd()) => {
  try {
    requireFromCwd(file)
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      require(Path.join(cwd, file));
    } else {
      throw error
    }
  }
};

utils.readFile = _ => {
  try {
    return fs.readFileSync(untildify(_), 'utf8');
  } catch (error) {
    return ''
  }
}

utils.interceptStdout = function*(flag) {
  if (!flag) return;
  const text = ['', ''];
  // trap
  const unhook = intercept(...text.map((t, i) => t => (text[i] += t) && ''));
  yield unhook;
  // release
  yield unhook();
  // replay
  yield [process.stdout, process.stderr].forEach((std, i) => std.write(text[i]));
};
