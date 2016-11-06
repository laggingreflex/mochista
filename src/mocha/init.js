import { tryRequire } from '../utils/require';

export default function initLoad( {
  root,
  compilers,
  requires
} ) {
  console.log( 'Loading...' );
  console.time( 'Total initial loading time' );
  loadCompilers( compilers, root );
  loadRequires( requires, root );
  console.timeEnd( 'Total initial loading time' );
}

export function loadCompilers( compilers, root ) {
  if ( !compilers.length ) return;
  console.log( 'Loading compilers...' );
  console.time( 'Loading compilers finished' );
  compilers.map( c => c.split( ':' ).pop() ).forEach( r => {
    console.log( r );
    console.time( r + ' finished' );
    tryRequire( r, root );
    console.timeEnd( r + ' finished' );
  } );
  console.timeEnd( 'Loading compilers finished' );
}

export function loadRequires( requires, root ) {
  if ( !requires.length ) return;
  console.log( 'Loading requires...' );
  console.time( 'Loading requires finished' );
  requires.forEach( r => {
    console.log( r );
    console.time( r + ' finished' );
    tryRequire( r, root );
    console.timeEnd( r + ' finished' );
  } );
  console.timeEnd( 'Loading requires finished' );
}
