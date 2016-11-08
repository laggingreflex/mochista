import pkg from '.../package.json';

export function printUsage( exit ) {
  console.log( `
    ${pkg.description}

    Usage: mochist [OPTION] [files]
      ...mocha options
      ...istanbul options

    Examples:
      mochist
  ` );
  if ( exit ) {
    process.exit( 0 );
  }
}
