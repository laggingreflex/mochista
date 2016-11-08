import assert from 'assert';
import { watch } from 'chokidar';
import debounce from 'debounce-queue';
import normalize from 'normalize-path';
import _ from 'lodash';
import log from '.../utils/logger';

export default function init( {
  root,
  include,
  exclude = [],
} ) {
  assert( root, 'Need a root' );
  assert( include && include.length, 'Need files to watch {include}' );

  const watcher = watch( include, {
    cwd: root,
    ignored: exclude,
  } );
  log( 'Readying watcher...' );
  return new Promise( ( _resolve, _reject ) => {
    watcher.once( 'ready', resolve );
    watcher.once( 'error', reject );

    function reject( error ) {
      watcher.removeListener( 'ready', resolve );
      watcher.close();
      _reject( error );
    }

    function resolve() {
      watcher.removeListener( 'error', reject );
      // log.debug( watcher.getWatched() );
      _resolve( watcher );
    }
  } );
}

export function createOnChange( watcher ) {
  return ( opts ) => onChange( { watcher, ...opts } );
}

export function onChange( {
  watcher,
  events = [ 'add', 'change' ],
  run,
  debounce: debounceDelay = 200,
  intersection
} ) {
  const debounced = debounce( changedFiles => {
    const intRet = {};
    if ( intersection ) {
      for ( const key in intersection )
        intRet[ key ] = _.intersection( intersection[ key ], changedFiles );
    }
    // log.debug( { changedFiles, ...intRet } );
    return run( { changedFiles, ...intRet } );
  }, debounceDelay );
  events.forEach( event => watcher
    .on( event, path =>
      debounced( normalize( path ) ) ) );
}
