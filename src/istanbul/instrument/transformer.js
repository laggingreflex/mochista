import { resolve, relative } from 'path';
import md5Hex from 'md5-hex';
import { readJSONSync, outputJsonSync } from 'fs-extra';
import { createInstrumenter } from 'istanbul-lib-instrument';
import convertSourceMap from 'convert-source-map';
import { createSourceMapStore } from 'istanbul-lib-source-maps';
import log from '.../utils/logger';
import pkg from '.../package.json';

export default function createTransformerFn({
  root,
  coverageVariable,
  transformerCacheVariable,
  sourceMapCacheVariable,
  cacheDir,
  disableCache = false,
  ext = '.js',
  verbose = true,
}) {
  const transformerCache = global[transformerCacheVariable] = global[transformerCacheVariable] || {};
  const sourceMapCache = global[sourceMapCacheVariable] = global[sourceMapCacheVariable] || createSourceMapStore();

  const instrumenter = createInstrumenter({
    autoWrap: true,
    coverageVariable,
    embedSource: true,
    noCompact: true,
    preserveComments: true
  });
  const instrument = instrumenter.instrumentSync.bind(instrumenter);

  return function transform(code, file) {
    let instrumentedCode, hasChanged, cacheFile, codeHash;

    cacheFile = resolve(cacheDir, relative(root, file)) + '.json';
    codeHash = md5Hex(code);

    const sourceMap = convertSourceMap.fromSource(code);
    sourceMapCache.registerMap(file, sourceMap.sourcemap);

    if (!transformerCache[file] /*first-run*/ ) try {
      const json = readJSONSync(cacheFile);
      if (json.hash === codeHash) {
        instrumentedCode = json.code;
        log.vrb(`Instrumented file loaded frm cache:`, file);
      }
    } catch (err) {
      log.vrb(`Instrumented file loaded frm cache:`, file);
      log.sil(`Couldn't read file from cache-dir :`, file, err.message, `(expected if running for the first time ever)`);
    }

    if (!instrumentedCode && transformerCache[file]) {
      const json = transformerCache[file];
      if (json && json.hash === codeHash) {
        instrumentedCode = json.code;
        log.sil(`Instrumented file loaded from mem :`, file);
      }
    }

    if (!instrumentedCode) {
      instrumentedCode = instrument(code, file);
      log.vrb(`Instrumentation generated for file:`, file);
    }

    transformerCache[file] = { code: instrumentedCode, hash: codeHash };
    try {
      outputJsonSync(cacheFile, transformerCache[file]);
      log.sil(`Instrumented file written to cache:`, file);
    } catch (err) {
      log.vrb(`Couldn't write instrumented cache :`, file, err.message);
    }

    return instrumentedCode;
  };
};
