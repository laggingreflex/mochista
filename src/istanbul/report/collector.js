import { createCoverageMap } from 'istanbul-lib-coverage';

export default function collect( { coverage, sourceMapCache } ) {
  let codeCoverageMap;
  codeCoverageMap = createCoverageMap( coverage );
  codeCoverageMap = sourceMapCache.transformCoverage( codeCoverageMap );
  return codeCoverageMap.map;
}
