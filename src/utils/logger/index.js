import debugLogger from 'debug-logger';
import config from '.../config';
import pkg from '.../package.json';
import levels from './levels';
import modErr from './err';

debugLogger.inspectOptions = {
  colors: config.noColors ? false : config.colors,
};

debugLogger.levels = levels;

export function createLogger(namespace) {
  debugLogger.debug.enable(namespace + ':log');
  debugLogger.debug.enable(namespace + ':error');
  debugLogger.debug.enable(namespace + ':warn');
  if (config.debug) {
    debugLogger.debug.enable(namespace + ':debug');
  }
  if (config.verbose >= 1) {
    debugLogger.debug.enable(namespace + ':debug');
    debugLogger.debug.enable(namespace + ':verb');
  }
  if (config.verbose >= 2) {
    debugLogger.debug.enable(namespace + ':info');
  }
  if (config.verbose >= 3) {
    debugLogger.debug.enable(namespace + ':*');
  }

  const logger = debugLogger(namespace);

  modErr(logger);

  const log = logger.log;
  log.logger = logger;
  Object.assign(log, logger);
  return log;
}

export default createLogger(pkg.name);
