import { props } from 'bluebird';
import _glob from 'globby';
import log from '.../utils/logger';

export default async function init({
  root,
  sourceFiles: sourceGlobs,
  sourceFilesExclude: sourceGlobsExclude,
  testFiles: testGlobs,
  testFilesExclude: testGlobsExclude,
  fileCountLimit,
}) {
  log('Initial files globbing...');
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

  log.verb(`globing ${label}...`);

  const files = await _glob([
    ...include,
    ...exclude.map(p => '!' + p),
  ], {
    cwd: root,
    root,
  });

  if (!files.length) {
    throw new Error(`ERROR: Couldn't find any {${label}: ${files.length}}. Check your include/exclude glob pattern.`);
  }
  if (files.length > fileCountLimit) {
    log.verb(files);
    throw new Error(`ERROR: Too many {${label}: ${files.length}}. Check your include/exclude glob patterns or increase {fileCountLimit: ${fileCountLimit}}`);
  }

  return files;
}
