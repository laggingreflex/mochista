export function separateBangExcludes( arr ) {
  if ( !arr || !arr.forEach ) {
    throw new Error( 'Expected it to be an array: ' + arr );
  }

  const
    includes = [],
    excludes = [];

  arr.forEach( f => {
    if ( !f || !f.charAt ) {
      throw new Error( 'Expected it to be a string: ' + f );
    }
    if ( f.charAt( 0 ) == '!' ) {
      excludes.push( f.substr( 1 ) );
    } else {
      includes.push( f );
    }
  } );

  return { includes, excludes };
}
