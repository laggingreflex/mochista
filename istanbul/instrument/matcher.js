const path = require('path');
const log = require('.../utils/logger');

export default function createMatcherFn({ files, root = process.cwd() }) {
  files = files.map(f => path.resolve(root, f));
  log.verbose(`Instrumenting ${files.length} files`);
  files.reverse().forEach(f => log.silly('', f));
  return file => files.includes(file);
}
