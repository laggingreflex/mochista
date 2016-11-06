import { promisify } from 'bluebird';
import Mocha from 'mocha';

export default async function runner( {
  files,
  ...config
} ) {
  console.log( 'Running mocha...' );
  console.time( 'Running mocha finished' );

  const mocha = new Mocha( config );
  mocha.files = files;
  mocha.grep( config.grep || null );

  await promisify( ::mocha.run )();
  console.timeEnd( 'Running mocha finished' );

  return mocha;
}
