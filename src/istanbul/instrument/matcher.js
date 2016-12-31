import path from 'path';
import log from '.../utils/logger';

export default function createMatcherFn({ files, root = process.cwd() }) {
  files = files.map(f => path.resolve(root, f));
  log.verb(`Instrumenting ${files.length} files`);
  files.reverse().forEach(f => log.sil('', f));
  return file => files.includes(file);
}
