import { resolve, relative } from 'path';
import md5Hex from 'md5-hex';
import { readJSONSync, outputJsonSync } from 'fs-extra';
import { createInstrumenter } from 'istanbul-lib-instrument';
import log from '.../utils/logger';
import pkg from '.../package.json';

export default function createTransformerFn( {
  root,
  coverageVariable,
  transformerCacheVariable,
  cacheDir,
  disableCache = false,
  ext = '.js',
  verbose = true,
} ) {
  const cache = global[transformerCacheVariable] = global[transformerCacheVariable] || {};

  const instrumenter = createInstrumenter( {
    autoWrap: true,
    coverageVariable,
    embedSource: true,
    noCompact: true,
    preserveComments: true
  } );
  const instrument = instrumenter.instrumentSync.bind(instrumenter);

  return function transform( code, file ) {
    let instrumentedCode, hasChanged, cacheFile, codeHash;

    cacheFile = resolve( cacheDir, relative( root, file ) ) + '.json';
    codeHash = md5Hex( code );

    if ( !cache[ file ] /*first-run*/ ) try {
      const json = readJSONSync( cacheFile );
      if ( json.hash === codeHash ) {
        instrumentedCode = json.code;
        log.vrb( `Instrumented file loaded frm cache:`, file );
      }
    } catch ( err ) {
      log.vrb( `Instrumented file loaded frm cache:`, file );
      log.sil( `Couldn't read file from cache-dir :`, file, err.message, `(expected if running for the first time ever)` );
    }

    if ( !instrumentedCode && cache[ file ] ) {
      const json = cache[ file ];
      if ( json && json.hash === codeHash ) {
        instrumentedCode = json.code;
        log.sil( `Instrumented file loaded from mem :`, file );
      }
    }

    if ( !instrumentedCode ) {
      instrumentedCode = instrument( code, file );
      log.vrb( `Instrumentation generated for file:`, file );
    }

    cache[ file ] = { code: instrumentedCode, hash: codeHash };
    try {
      outputJsonSync( cacheFile, cache[ file ] );
      log.sil( `Instrumented file written to cache:`, file );
    } catch ( err ) {
      log.vrb( `Couldn't write instrumented cache :`, file, err.message );
    }

    return instrumentedCode;
  };
};
