import log from '.../utils/logger';
import collect from './collector';
import report from './reporter';

export default async function Report( {
  coverageVariable = '__coverage__',
  sourceMapCacheVariable,
  reportDir,
  coverageReporter: reporters,
  verbose = false,
  watermarks = true,
} = {} ) {
  const coverage = global[ coverageVariable ];
  const sourceMapCache = global[ sourceMapCacheVariable ];

  let codeCoverageMap;

  try {
    codeCoverageMap = collect( { coverage, sourceMapCache } );
  } catch ( err ) {
    log.err( `Couldn't collect coverage.` );
    throw err;
  }

  try {
    await report( codeCoverageMap, { reportDir, reporters } );
  } catch ( err ) {
    log.err( `Couldn't write coverage.`, err );
  }

  return codeCoverageMap;
}
