import { hookRequire } from 'istanbul-lib-hook';
import matcher from './matcher';
import transformer from './transformer';

export default function instrument( {
  root,
  coverageVariable,
  transformerCacheVariable,
  cacheDir,
  files,
  preserveComments = true,
  extensions = [ '.js' ],
  verbose,
} = {} ) {
  global[ coverageVariable ] = global[ coverageVariable ] || {};

  const hookOpts = { verbose, extensions };
  hookRequire(
    matcher( { files } ),
    transformer( { root, coverageVariable, transformerCacheVariable, cacheDir, verbose } ),
    hookOpts
  );
}
