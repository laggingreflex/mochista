import { promisify } from 'bluebird';
import init from './init';
import log from '.../utils/logger';

export default async function run( { files, ...config } ) {
  log( 'Running mocha...' );
  log.time( 'Mocha finished in' );

  const mocha = init( config );
  mocha.files = files;

  try {
    await promisify( ::mocha.run )();
  } catch ( failures ) {

  }

  log.timeEnd( 'Mocha finished in', 'info' );

  return mocha;
}
