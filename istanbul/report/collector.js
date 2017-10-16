const { createCoverageMap } = require('istanbul-lib-coverage');

module.exports = function collect({ coverage, sourceMapCache }) {
  let codeCoverageMap;
  codeCoverageMap = createCoverageMap(coverage);
  if (sourceMapCache) {
    codeCoverageMap = sourceMapCache.transformCoverage(codeCoverageMap);
  }
  return codeCoverageMap.map || codeCoverageMap;
}
