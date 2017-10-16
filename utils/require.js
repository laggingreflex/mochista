const Module = require('module');
const assert = require('assert');
const { join } = require('path');
const reqFrom = require('req-from');
const log = require('./logger');

const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

module.exports.tryRequire = function (path, root) {
  assert(path, 'Need a path to require');
  log.verbose(`Requiring '${path}'...`);
  const ret = requireNative(path)
    || resolveFromRoot(path, root)
    || requireFromRoot(path, root);
  if (ret) {
    return ret;
  } else {
    // Best way to throw in this case is to just call the NodeJS's internal module, so that it shows the "Module not found" as naturally as it does with regular module requires.
    return (Module.__resolveFilename || Module._resolveFilename)(`${path}' from '${root}`);
  }
}

module.exports.requireNative = function (path) {
  log.silly(`requireNative: {path: '${path}'}`);
  try {
    const ret = require(path);
    log.silly(`success: requireNative: {path: '${path}'}`);
    return ret;
  } catch (err) {
    log.silly(`fail: requireNative: {path: '${path}'}`, err.message);
    if (err.code === MODULE_NOT_FOUND) {
      return false;
    } else {
      throw err;
    }
  }
}

module.exports.resolveFromRoot = function (path, root) {
  assert(root, 'Need a root path to require from');
  const reqPath = join(root, path);
  log.silly(`resolveFromRoot: '${reqPath}'`);
  try {
    const ret = require(reqPath);
    log.silly(`success: resolveFromRoot: '${reqPath}'`);
    return ret;
  } catch (err) {
    log.silly(`fail: resolveFromRoot: '${reqPath}'`, err.message);
    const erRex = path
    .replace(/^[./\\]+/, '')
    .replace(/[\\/]/g, '[\\\\/]');
    if (err.code === MODULE_NOT_FOUND && err.message.match(erRex)) {
      return false;
    } else {
      err.message = `Error in '${path}': ${err.message}`;
      throw err;
    }
  }
}

module.exports.requireFromRoot = function (path, root) {
  assert(root, 'Need a root path to require from');
  log.silly(`requireFromRoot: {path: '${path}'} from {root: '${root}'}`);
  try {
    const ret = reqFrom(root, path);
    log.silly(`success: requireFromRoot: {path: '${path}'} from {root: '${root}'}`);
    return ret;
  } catch (err) {
    log.silly(`fail: requireFromRoot: {path: '${path}'} from {root: '${root}'}`, err.message);
    if (err.message === 'missing path') {
      return false;
    } else {
      err.message = `Error in '${path}': ${err.message}`;
      throw err;
    }
  }
}

