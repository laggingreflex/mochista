const _ = require('lodash');
const { props } = require('bluebird');
const _glob = require('globby');
const log = require('.../utils/logger');

module.exports = async function init({
  root = process.cwd(),
  sourceGlobs = [],
  sourceGlobsExclude = [],
  testGlobs = [],
  testGlobsExclude = [],
  fileCountLimit = 1000,
}) {
  log('Globing files...');

  return props({
    testFiles: glob({
      root,
      include: testGlobs,
      exclude: testGlobsExclude,
      label: 'testFiles',
      fileCountLimit,
    }),
    sourceFiles: glob({
      root,
      include: sourceGlobs,
      exclude: sourceGlobsExclude.concat(testGlobs),
      label: 'sourceFiles',
      fileCountLimit,
    })
  });
}

export async function glob({
  root,
  include = [],
  exclude = [],
  fileCountLimit = 1000,
  label = 'files',
} = {}) {

  const pLabel = _.startCase(label).toLowerCase();

  log.verbose(`Globing ${pLabel}...`);

  const files = await _glob([
    ...include,
    ...exclude.map(p => '!' + p),
  ], {
    cwd: root,
    root,
  });

  if (!files.length) {
    throw new Error(`ERROR: Couldn't find any {${pLabel}: ${files.length}}. Check your include/exclude glob pattern.\n{ include: ${include}, exclude: ${exclude} }`);
  }
  if (files.length > fileCountLimit) {
    log.verbose(files);
    throw new Error(`ERROR: Too many {${pLabel}: ${files.length}}. Check your include/exclude glob patterns or increase {fileCountLimit: ${fileCountLimit}}\n{ include: ${include}, exclude: ${exclude} }`);
  }

  log.verbose(_.capitalize(pLabel), 'found:', files.length);
  files.reverse().forEach(f => log.silly('', f));

  return files;
}
