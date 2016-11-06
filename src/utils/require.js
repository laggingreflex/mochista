import assert from 'assert';
import { resolve } from 'path';
import reqFrom from 'req-from';

export function tryRequire( path, root ) {
  assert( path, 'Need a path to require' );
  const ret =
    requireNative( path )
    || requireFromRoot( path, root )
    || resolveFromRoot( path, root );

  if ( ret ) {
    return ret;
  } else {
    throw new Error( `Couldn't require {path: ${path}} from {root: ${root}}` );
  }
}

export function requireNative( path ) {
  try {
    return module.require( path );
  } catch ( error ) {
    console.log( 'requireNative', { error: error.message, } );
    return false;
  }
}

export function requireFromRoot( path, root ) {
  assert( root, 'Need a root path to require from' );
  try {
    return reqFrom( root, path );
  } catch ( error ) {
    console.log( 'requireFromRoot', { error: error.message, path, root } );
    return false;
  }
}

export function resolveFromRoot( path, root ) {
  assert( root, 'Need a root path to require from' );
  try {
    path = resolve( root, path );
    return requireNative( path );
  } catch ( error ) {
    console.log( 'resolveFromRoot', { error: error.message, } );
    return false;
  }
}
