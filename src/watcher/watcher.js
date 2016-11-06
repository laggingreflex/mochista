import assert from 'assert';
import { watch } from 'chokidar';
import debounce from 'debounce-queue';
import normalize from 'normalize-path';
import _ from 'lodash';

export default function init( {
  root,
  include,
  exclude = [],
} ) {
  assert( root, 'Need a root' );
  assert( include, 'Need files to watch {include}' );
  const watcher = watch( include, {
    cwd: root,
    ignored: exclude,
  } );
  console.log( 'Readying watcher...' );
  console.time( 'Readying watcher finished' );
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
      // console.log( watcher.getWatched() );
      console.timeEnd( 'Readying watcher finished' );
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
  const debounced = debounce( ( changedFiles ) => {
    const intRet = {};
    if ( intersection ) {
      for ( const key in intersection )
        intRet[ key ] = _.intersection( intersection[ key ], changedFiles );
    }
    console.log( { changedFiles, ...intRet } );
    run( { changedFiles, ...intRet } );
  }, debounceDelay );
  events.forEach( event => watcher
    .on( event, path =>
      debounced( normalize( path ) ) ) );
}
