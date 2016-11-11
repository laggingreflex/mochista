import log from '.../utils/logger';
import collect from './collector';
import report from './reporter';

export default async function Report( {
  coverageVariable = '__coverage__',
  reportDir,
  coverageReporter: reporters,
  verbose = false,
  watermarks = true,
} = {} ) {
  const coverage = global[ coverageVariable ];
  let map;

  try {
    map = collect( coverage );
  } catch ( err ) {
    log.err( `Couldn't collect coverage.` );
    throw err;
  }

  try {
    await report( map, { reportDir, reporters } );
  } catch ( err ) {
    log.err( `Couldn't write coverage.`, err );
  }

  return map;
}
