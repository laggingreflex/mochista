import { mkdirp } from 'fs-promise';
import { promisify } from 'bluebird';
import { Reporter } from 'babel-istanbul';

export default async function report( coverage, {
  reportDir = 'coverage',
  reporters = [ 'lcov', 'text' ],
} = {} ) {
  const reporter = new Reporter();
  reporter.dir = reportDir;
  await mkdirp( reportDir );
  reporter.addAll( reporters );
  return await promisify( ::reporter.write )( coverage, true );
}
