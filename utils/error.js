const config = require('.../config');
const log = require('.../utils/logger');

export default function handleErrors(err) {
  log.error(err);

  // process.exit(err.exitcode || 1);
}

process.on('unhandledRejection', handleErrors);
process.on('uncaughtException', handleErrors);