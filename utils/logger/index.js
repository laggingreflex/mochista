const debugLogger = require('debug-logger');
const pkg = require('.../package.json');
const levels = require('./levels');
const modErr = require('./err');

debugLogger.levels = levels;

export const config = (config, namespace = pkg.name) => {
  debugLogger.inspectOptions = {
    colors: config.noColors ? false : config.colors,
  };

  debugLogger.debug.enable(Object.entries({
    log: true,
    error: true,
    warn: true,
    debug: config.debug || config.verbose >= 1,
    info: config.verbose >= 2,
    verbose: config.verbose,
    silly: config.verbose >= 3,
    trace: config.verbose >= 3,
    '*': config.verbose >= 3,
  }).filter(([, v]) => v).map(([l]) => l).map(e => namespace + ':' + e).join(','));
};

export function createLogger(namespace = pkg.name, argConfig = {}) {
  config(argConfig, namespace);

  const logger = debugLogger(namespace);

  modErr(logger);

  const log = logger.log;
  log.logger = logger;
  Object.assign(log, logger);
  return log;
}

module.exports = createLogger(pkg.name);
