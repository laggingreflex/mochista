import { Instrumenter, hook } from 'babel-istanbul';
import matchFn from './match';
import transformerFn from './transformer';

export default function instrument( {
  root,
  coverageVariable = '__cov__',
  coverageCacheVariable = '__cov_cache__',
  files,
  changedFiles,
  preserveComments = true,
  extensions = [ '.js' ],
  verbose = false,
} = {} ) {
  global[ coverageVariable ] = global[ coverageVariable ] || {};
  global[ coverageCacheVariable ] = global[ coverageCacheVariable ] || {};
  global.transformerCache = global.transformerCache || {};

  const instrumenter = new Instrumenter( { coverageVariable, preserveComments } );
  const transformer = ::instrumenter.instrumentSync;

  const hookOpts = { verbose, extensions };

  hook.hookRequire(
    matchFn( { files } ),
    transformerFn( {
      transformer,
      cache: global.transformerCache,
      changedFiles,
    } ),
    hookOpts
  );
}
