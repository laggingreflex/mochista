import { Collector, Reporter } from 'babel-istanbul';
import fs from 'fs-promise';
import { promisify } from 'bluebird';
import _ from 'lodash';
import log from '.../utils/logger';

export default async function report( {
  coverageVariable = '__cov__',
  coverageCacheVariable = '__cov_cache__',
  reportDir = 'coverage',
  coverageReporter: reporters = [ 'lcov', 'text' ],
  verbose = false,
  watermarks = true,
} = {} ) {
  const collector = new Collector();
  const reporter = new Reporter();
  const cov = global[ coverageVariable ];

  const cache = global[ coverageCacheVariable ];
  if ( cache && Object.keys( cache ).length ) {
    _.merge( cov, cache, cov );
  }
  global[ coverageCacheVariable ] = cov;

  await fs.mkdirp( reportDir );

  reporter.dir = reportDir;
  reporters.map( ::reporter.add );
  collector.add( cov );

  await promisify( ::reporter.write )( collector, true );
}
