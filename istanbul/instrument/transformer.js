const { resolve, relative } = require('path');
const md5Hex = require('md5-hex');
const { readJSONSync, outputJsonSync } = require('fs-extra');
const { createInstrumenter } = require('istanbul-lib-instrument');
const convertSourceMap = require('convert-source-map');
const { createSourceMapStore } = require('istanbul-lib-source-maps');
const log = require('.../utils/logger');
const pkg = require('.../package.json');
const pad = require('.../utils/pad');

module.exports = function createTransformerFn({
  root,
  coverageVariable,
  transformerCacheVariable,
  sourceMapCacheVariable,
  cacheDir,
  disableCache = false,
  ext = '.js',
  verbose = false,
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
    if (sourceMap) {
      sourceMapCache.registerMap(file, sourceMap.sourcemap);
    }

    if (!transformerCache[file] /*first-run*/ ) try {
      const json = readJSONSync(cacheFile);
      if (json.hash === codeHash) {
        instrumentedCode = json.code;
        log.verbose(pad(39, `Instrumentation loaded from cache for:`), file);
      }
    } catch (err) {
      log.verbose(pad(39, `Instrumentation loaded from cache for:`), file);
      log.silly(pad(39, `Couldn't read cache from cache-dir for:`), file, err.message, `[this is expected on the first ever run]`);
    }

    if (!instrumentedCode && transformerCache[file]) {
      const json = transformerCache[file];
      if (json && json.hash === codeHash) {
        instrumentedCode = json.code;
        log.silly(pad(39, `Instrumentation loaded from memory for:`), file);
      }
    }

    if (!instrumentedCode) {
      instrumentedCode = instrument(code, file);
      log.verbose(pad(39, `Instrumentation generated for file:`), file);
      hasChanged = true;
    }

    transformerCache[file] = { code: instrumentedCode, hash: codeHash };

    if (hasChanged) {
      try {
        outputJsonSync(cacheFile, transformerCache[file]);
        log.silly(pad(39, `Instrumentation written to cache for:`), file);
      } catch (err) {
        log.verbose(pad(39, `Couldn't cache Instrumentation for:`), file, err.message);
      }
    }

    return instrumentedCode;
  };
};

