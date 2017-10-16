const config = require('../config');
const log = require('./logger');

module.exports = function handleErrors(err) {
  log.error(err);

  // process.exit(err.exitcode || 1);
}

process.on('unhandledRejection', module.exports);
process.on('uncaughtException', module.exports);
