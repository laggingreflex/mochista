var fs = require( 'fs' );
module.exports = getOptions;

function getOptions() {
  var optsPath = process.argv.indexOf( '--opts' ) === -1
    ? 'test/mocha.opts'
    : process.argv[ process.argv.indexOf( '--opts' ) + 1 ];

  try {
    var opts = fs.readFileSync( optsPath, 'utf8' );
    if ( opts.match( /[\n\r]/ ) ) {
      // multiline options
      opts = opts.split( /[\n\r]+/ );
      opts = opts.filter( arg => arg.charAt( 0 ) !== '#' );
      opts = opts.reduce( ( opts, line ) => opts.concat( line.split( /[\s]+/ ) ), [] );
    } else {
      opts = opts.split( /\s/ );
    }
    opts = opts.filter( Boolean );
    opts = opts.map( value => value.replace( /%20/g, ' ' ) );
  } catch ( err ) {}

  process.env.LOADED_MOCHA_OPTS = true;
  return opts;
}
