import assert from 'assert';
import { join } from 'path';
import reqFrom from 'req-from';
import log from '.../utils/logger';

const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

export function tryRequire(path, root) {
  assert(path, 'Need a path to require');
  log.verb(`Requiring '${path}'...`);
  const ret = requireNative(path)
    || resolveFromRoot(path, root)
    || requireFromRoot(path, root);
  if (ret) {
    return ret;
  } else {
    const err = new Error(`Cannot find module '${path}' from '${root}'`);
    err.code = MODULE_NOT_FOUND;
    throw err;
  }
}

export function requireNative(path) {
  log.silly(`requireNative: {path: '${path}'}`);
  try {
    return module.require(path);
  } catch (err) {
    if (err.code === MODULE_NOT_FOUND) {
      return false;
    } else {
      throw err;
    }
  }
}

export function resolveFromRoot(path, root) {
  assert(root, 'Need a root path to require from');
  const reqPath = join(root, path);
  log.silly(`resolveFromRoot: '${reqPath}'`);
  try {
    return module.require(reqPath);
  } catch (err) {
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

export function requireFromRoot(path, root) {
  assert(root, 'Need a root path to require from');
  log.silly(`requireFromRoot: {path: '${path}'} from {root: '${root}'}`);
  try {
    return reqFrom(root, path);
  } catch (err) {
    if (err.message === 'missing path') {
      return false;
    } else {
      err.message = `Error in '${path}': ${err.message}`;
      throw err;
    }
  }
}

