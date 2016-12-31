import mm from 'micromatch';
import path from 'path';
import log from '.../utils/logger';

export default function resetRequireCache(filesToDelete, {root = process.cwd()} = {}) {
  filesToDelete = filesToDelete.map(f => path.resolve(root, f))
  log.verb(`Resetting ${filesToDelete.length} files`)

  for (const cacheFile in require.cache) {
    if (filesToDelete.includes(cacheFile)) {
      log.silly('', cacheFile);
      delete require.cache[cacheFile];
    }
  }
}
