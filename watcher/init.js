const assert = require('assert');
const { FSWatcher, watch } = require('chokidar');
const debounce = require('debounce-queue');
const normalize = require('normalize-path');
const anymatch = require('anymatch');
const log = require('../utils/logger');

// temporary patch for chokidar#561
const org_addToNodeFs = FSWatcher.prototype._addToNodeFs;
FSWatcher.prototype._addToNodeFs = function patched_addToNodeFs(path, initialAdd, priorWh, depth, target, callback) {
  org_addToNodeFs.call(this, path, initialAdd, null, depth, target, callback);
};

module.exports = function init({
  root,
  include,
  exclude = [],
  onChange
}) {
  assert(root, 'Need a root');
  assert(include && include.length, 'Need files to watch {include}');

  log('Readying watcher...');
  log.verbose(`Include ${include.length} files`);
  include.forEach(f => log.silly('', f));
  if (exclude.length) {
    log.verbose(`Exclude ${exclude.length} files`);
    exclude.forEach(f => log.silly('', f));
  }
  const watcher = watch(include, {
    cwd: root,
    ignored: exclude,
  });
  watcher.on('all', (event, path, info) => log.silly('Watcher event:', event, path));
  return new Promise((resolve, reject) => {
    watcher.once('ready', _resolve);
    watcher.once('error', _reject);
    const timeoutSecs = 3;
    let resolved = false;
    const debouncedTimeout = debounce(timeout, timeoutSecs * 1000);
    watcher.on('all', debouncedTimeout);

    function _reject(error) {
      if (resolved) {
        return;
      }
      resolved = true;
      watcher.removeListener('ready', _resolve);
      watcher.removeListener('all', debouncedTimeout);
      watcher.close();
      reject(error);
    }

    function _resolve() {
      if (resolved) {
        return;
      }
      resolved = true;
      watcher.removeListener('error', _reject);
      watcher.removeListener('all', debouncedTimeout);
      const watchedPaths = watcher.getWatched();
      log.silly('Watched paths:', watchedPaths);
      resolve(watcher);
    }

    function timeout() {
      if (resolved) {
        return;
      }
      resolved = true;
      watcher.removeListener('ready', _resolve);
      watcher.removeListener('error', _reject);
      log.warn(`Timed out waiting for watcher "ready" event. Proceeding anyway... (See #chokidar issue in the README)`);
      const watchedPaths = watcher.getWatched();
      log.silly('Watched paths:', watchedPaths);
      resolve(watcher);
    }
  });
}

module.exports.createOnChange = function (watcher) {
  return (opts) => onChange({ watcher, ...opts });
}

module.exports.onChange = function ({
  watcher,
  events = ['add', 'change'],
  run,
  debounce: debounceDelay = 1000,
  separateByGlobs
}) {
  const debounced = debounce(changedFiles => {
    const separatedFiles = {};
    if (separateByGlobs) {
      for (const key in separateByGlobs) {
        separatedFiles[key] = changedFiles.filter(f => anymatch(separateByGlobs[key], f));
      }
    }
    return run({ changedFiles, ...separatedFiles });
  }, debounceDelay, { sleep: true });
  events.forEach(event => watcher
    .on(event, path =>
      debounced(normalize(path))));
}
