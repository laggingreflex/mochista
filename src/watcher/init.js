import assert from 'assert';
import { watch } from 'chokidar';
import debounce from 'debounce-queue';
import normalize from 'normalize-path';
import _ from 'lodash';
import anymatch from 'anymatch';
import log from '.../utils/logger';

export default function init({
  root,
  include,
  exclude = [],
  onChange
}) {
  assert(root, 'Need a root');
  assert(include && include.length, 'Need files to watch {include}');

  const watcher = watch(include, {
    cwd: root,
    ignored: exclude,
  });
  log('Readying watcher...');
  return new Promise((_resolve, _reject) => {
    watcher.once('ready', resolve);
    watcher.once('error', reject);

    function reject(error) {
      watcher.removeListener('ready', resolve);
      watcher.close();
      _reject(error);
    }

    function resolve() {
      watcher.removeListener('error', reject);
      // log.debug( watcher.getWatched() );
      _resolve(watcher);
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
