import { props } from 'bluebird';
import _glob from 'globby';
import log from '.../utils/logger';

export default async function init({
  root,
  sourceGlobs,
  sourceGlobsExclude,
  testGlobs,
  testGlobsExclude,
  fileCountLimit,
}) {
  log('Initial files globbing...');
  return props({
    testFilesList: glob({
      root,
      include: testGlobs,
      exclude: testGlobsExclude,
      label: 'testFiles',
      fileCountLimit,
    }),
    sourceFilesList: glob({
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

  if (files.length > fileCountLimit) {
    log.verb(files);
    throw new Error(`ERROR: Too many {${label}: ${files.length}}. Check your include/exclude glob patterns or increase {fileCountLimit: ${fileCountLimit}}`);
  }

  // log.debug({[label]: files});

  return files;
}
