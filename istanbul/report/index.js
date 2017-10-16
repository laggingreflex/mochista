import Path from 'path';
import log from '.../utils/logger';
import collect from './collector';
import report from './reporter';

export default async function Report({
  coverageVariable = '__coverage__',
  sourceMapCacheVariable,
  reportDir,
  coverageReporter: reporters,
  verbose = false,
  watermarks = true,
  instrument,
  sourceFiles,
  root,
} = {}) {
  sourceFiles = sourceFiles.map(s => Path.join(root, s));

  const coverage = global[coverageVariable];

  if (!coverage) {
    if (instrument === false) {
      throw new Error(`Couldn't collect coverage. \`global['${coverageVariable}']\` was empty. It seems you've set \`--instrument=false\`, please make sure you're instrumenting code externally (eg. via babel-plugin-istanbul) and that the instrumented code is available in the global coverage variable: ${coverageVariable}`);
    } else {
      throw new Error(`Couldn't collect coverage. \`global['${coverageVariable}']\` was empty.`);
    }
  }

  for (const file in coverage) {
    if (!sourceFiles.includes(file)) {
      delete coverage[file]
    }
  }

  let sourceMapCache;
  if (sourceMapCacheVariable) {
    sourceMapCache = global[sourceMapCacheVariable];
  }

  let codeCoverageMap;

  try {
    codeCoverageMap = collect({ coverage, sourceMapCache });
  } catch (err) {
    log.error('Couldn\'t collect coverage.', err);
    throw err;
  }

  try {
    await report(codeCoverageMap, { reportDir, reporters });
  } catch (err) {
    log.error('Couldn\'t write coverage.', err);
  }

  return codeCoverageMap;
}
