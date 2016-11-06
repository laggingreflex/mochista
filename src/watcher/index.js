import initGlobs from './glob';
import initWatcher, { createOnChange } from './watcher';

export default async function Watcher( {
  root,
  sourceFiles: sourceGlobs,
  sourceFilesExclude: sourceGlobsExclude,
  testFiles: testGlobs,
  testFilesExclude: testGlobsExclude,
  fileCountLimit,
} = {} ) {

  const initGlobsPromise = initGlobs( {
    root,
    sourceGlobs,
    sourceGlobsExclude,
    testGlobs,
    testGlobsExclude,
    fileCountLimit,
  } );

  const initWatcherPromise = initWatcher( {
    root,
    include: [
      ...sourceGlobs,
      ...testGlobs,
    ],
    exclude: [
      ...sourceGlobsExclude,
      ...testGlobsExclude,
    ],
  } );

  const [ { sourceFilesList, testFilesList }, watcher ] = await Promise.all( [
    initGlobsPromise,
    initWatcherPromise,
  ] );

  return {
    testFiles: testFilesList,
    sourceFiles: sourceFilesList,
    watcher,
    onChange( opts ) {
      createOnChange( watcher )( {
        intersection: {
          testFiles: testFilesList,
          sourceFiles: sourceFilesList,
          ...opts.intersection
        },
        ...opts
      } );
    }
  };
}
