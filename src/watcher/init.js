import assert from 'assert';
import { FSWatcher, watch } from 'chokidar';
import debounce from 'debounce-queue';
import normalize from 'normalize-path';
import anymatch from 'anymatch';
import log from '.../utils/logger';

// temporary patch for chokidar#561
const org_addToNodeFs = FSWatcher.prototype._addToNodeFs;
FSWatcher.prototype._addToNodeFs = function patched_addToNodeFs (path, initialAdd, priorWh, depth, target, callback) {
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
  log.verb(`Include ${include.length} files`)
  include.forEach(f => log.sil('', f))
  if (exclude.length) {
    log.verb(`Exclude ${exclude.length} files`)
    exclude.forEach(f => log.sil('', f))
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
    let timer;
    const extendTimeout = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(timeout, timeoutSecs * 1000);
    }
    extendTimeout();
    watcher.on('all', extendTimeout);

    function _reject(error) {
      clearTimeout(timer);
      watcher.removeListener('ready', _resolve);
      watcher.removeListener('all', extendTimeout);
      watcher.close();
      reject(error);
    }

    function _resolve() {
      clearTimeout(timer);
      watcher.removeListener('error', _reject);
      watcher.removeListener('all', extendTimeout);
      const watchedPaths = watcher.getWatched();
      log.sil(`Watched paths:`, watchedPaths)
      resolve(watcher);
    }

    function timeout() {
      watcher.removeListener('ready', _resolve);
      watcher.removeListener('error', _reject);
      log.warn(`Timed out (${timeoutSecs}s) waiting for watcher "ready" event. Proceeding anyway... (report this in case of some weird behavior)`);
      const watchedPaths = watcher.getWatched();
      log.sil(`Watched paths:`, watchedPaths)
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
    if (separateByGlobs)
      for (const key in separateByGlobs)
        separatedFiles[key] = changedFiles.filter(f => anymatch(separateByGlobs[key], f));
    return run({ changedFiles, ...separatedFiles });
  }, debounceDelay);
  events.forEach(event => watcher
    .on(event, path =>
      debounced(normalize(path))));
}
