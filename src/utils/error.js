import config from '.../config';
import log from '.../utils/logger';

export default function handleErrors( err ) {
  log.err( err );
  process.exit( err.exitcode || 1 );
}

process.on( 'unhandledRejection', handleErrors );
process.on( 'uncaughtException', handleErrors );
