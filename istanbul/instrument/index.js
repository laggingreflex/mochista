const { hookRequire } = require('istanbul-lib-hook');
const matcher = require('./matcher');
const transformer = require('./transformer');

module.exports = function instrument({
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
