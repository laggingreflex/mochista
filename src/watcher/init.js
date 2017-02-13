import assert from 'assert';
import { FSWatcher, watch } from 'chokidar';
import debounce from 'debounce-queue';
import normalize from 'normalize-path';
import anymatch from 'anymatch';
import log from '.../utils/logger';

// temporary patch for chokidar#561
const org_addToNodeFs = FSWatcher.prototype._addToNodeFs;
FSWatcher.prototype._addToNodeFs = function patched_addToNodeFs(path, initialAdd, priorWh, depth, target, callback) {
  org_addToNodeFs.call(this, path, initialAdd, null, depth, target, callback);
};

export default function init({
  root,
  include,
  exclude = [],
  onChange
}) {
  assert(root, 'Need a root');
  assert(include && include.length, 'Need files to watch {include}');

  log('Readying watcher...');
  log.verb(`Include ${include.length} files`);
  include.forEach(f => log.sil('', f));
  if (exclude.length) {
    log.verb(`Exclude ${exclude.length} files`);
    exclude.forEach(f => log.sil('', f));
  }
  const watcher = watch(include, {
    cwd: root,
    ignored: exclude,
  });
  watcher.on('all', (event, path, info) => log.sil('Watcher event:', event, path));
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
      log.sil('Watched paths:', watchedPaths);
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
      log.sil('Watched paths:', watchedPaths);
      resolve(watcher);
    }
  });
}

export function createOnChange(watcher) {
  return (opts) => onChange({ watcher, ...opts });
}

export function onChange({
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
