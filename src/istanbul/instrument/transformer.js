import mm from 'micromatch';
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
      // console.log( 'transformed cache', file );
    }

    if ( hasChanged || !transformed ) {
      console.time( `Instrumenting ${file}` );
      transformed = cache[ file ] = transformer( code, file );
      console.timeEnd( `Instrumenting ${file}` );
    }

    return transformed;
  };
};
