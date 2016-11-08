import config from '.../config';
import log from '.../utils/logger';

export default function handleErrors( err ) {
  if (config.debug) {
    log.err( err );
  } else {
    log.err( err.message );
  }
  process.exit(1);
}

process.on( 'unhandledRejection', handleErrors );
process.on( 'uncaughtException', handleErrors );
