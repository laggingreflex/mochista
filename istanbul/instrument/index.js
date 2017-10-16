import { hookRequire } from 'istanbul-lib-hook';
import matcher from './matcher';
import transformer from './transformer';

export default function instrument({
  root,
  coverageVariable,
  transformerCacheVariable,
  sourceMapCacheVariable,
  cacheDir,
  files,
  preserveComments = true,
  extensions = ['.js'],
  verbose = 0,
} = {}) {
  global[coverageVariable] = global[coverageVariable] || {};

  const hookOpts = { extensions, verbose: verbose > 3 };
  hookRequire(
    matcher({ files }),
    transformer({ root, coverageVariable, transformerCacheVariable, sourceMapCacheVariable, cacheDir, verbose }),
    hookOpts
  );
}
