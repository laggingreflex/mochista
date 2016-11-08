import assert from 'assert';
import { resolve } from 'path';
import reqFrom from 'req-from';
import log from '.../utils/logger';

export function tryRequire( path, root ) {
  assert( path, 'Need a path to require' );
  log.verb( `Requiring ${path}` );
  const errs = [];
  for ( let [ err, mod ] of[
      requireNative( path ),
      requireFromRoot( path, root ),
      resolveFromRoot( path, root )
    ] ) {
    if ( mod ) return mod;
    errs.push( err );
  }

  const error = new Error(
    `Couldn't require {path: ${path}} from {root: ${root}}.`
    // + errs.reduce( ( m, e ) => m + '\n\t' + e.message, '' )
  );
  error.errors = errs;
  throw error;
}

export function requireNative( path ) {
  log.silly( `requireNative: {path: ${path}}` );
  try {
    return [ null, module.require( path ) ];
  } catch ( error ) {
    error.message = 'requireNative: ' + error.message;
    return [ error ];
  }
}

export function requireFromRoot( path, root ) {
  assert( root, 'Need a root path to require from' );
  log.silly( `requireFromRoot: {path: ${path}} from {root: ${root}}` );
  try {
    return [ null, reqFrom( root, path ) ];
  } catch ( error ) {
    error.message = 'requireFromRoot: ' + error.message;
    return [ error ];
  }
}

export function resolveFromRoot( path, root ) {
  assert( root, 'Need a root path to require from' );
  log.silly( `resolveFromRoot: {path: ${path}} from {root: ${root}}` );
  try {
    return [ null, module.require( resolve( root, path ) ) ];
  } catch ( error ) {
    error.message = 'resolveFromRoot: ' + error.message;
    return [ error ];
  }
}
