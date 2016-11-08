import mm from 'micromatch';
import log from '.../utils/logger';

export default function transformerFn( {
  transformer,
  cache,
  changedFiles
} ) {
  return ( code, file ) => {
    let transformed, hasChanged, cached;

    cached = cache[ file ];

    for ( const c of changedFiles )
      if ( hasChanged = mm.contains( file, c ) )
        break;

    if ( cached ) {
      transformed = cache[ file ];
      // log.log( 'transformed cache', file );
    }

    if ( hasChanged || !transformed ) {
      log.verb( `Instrumenting ${file}` );
      transformed = cache[ file ] = transformer( code, file );
    }

    return transformed;
  };
};
