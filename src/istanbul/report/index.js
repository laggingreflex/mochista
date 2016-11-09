import { merge } from 'lodash';
import log from '.../utils/logger';
import report from './reporter';
import collect from './collector';

export default async function Report( {
  coverageVariable = '__cov__',
  coverageCacheVariable = '__cov_cache__',
  reportDir,
  coverageReporter: reporters,
  verbose = false,
  watermarks = true,
} = {} ) {
  const data = global[ coverageVariable ];
  let coverage = global[ coverageCacheVariable ];

  try {
    if ( !coverage || !coverage.add ) {
      log( `Generating coverage...` );
      coverage = collect( data );
    } else {
      log( `Generating coverage using cache...` );
      coverage.merge( data );
    }
  } catch ( err ) {
    log.err( `Couldn't generate coverage.` );
    throw err;
  }

  try {
    await report( coverage, { reportDir, reporters } );
  } catch ( err ) {
    log.err( `Couldn't write coverage.`, err );
  }

  global[ coverageCacheVariable ] = coverage;
  return coverage;
}
