import mm from 'micromatch';
import initWatcher, { createOnChange } from './init';
import initGlobs from './glob';
import log from '.../utils/logger';

export default async function Watcher({
  root,
  sourceFiles: sourceGlobs,
  sourceFilesExclude: sourceGlobsExclude,
  testFiles: testGlobs,
  testFilesExclude: testGlobsExclude,
  fileCountLimit,
} = {}) {

  const {
    testFiles: initialTestFiles,
    sourceFiles: initialSourceFiles
  } = await initGlobs({
    root,
    sourceGlobs,
    sourceGlobsExclude,
    testGlobs,
    testGlobsExclude,
    fileCountLimit,
  });
  const initialAllFiles = initialSourceFiles.concat(initialTestFiles);

  let testFiles = initialTestFiles;
  let sourceFiles = initialSourceFiles;
  const allFiles = () => sourceFiles.concat(testFiles);

  const watcher = await initWatcher({
    root,
    include: [
      ...sourceGlobs,
      ...testGlobs,
    ],
    exclude: [
      ...sourceGlobsExclude,
      ...testGlobsExclude,
    ],
  });

  const separateByGlobs = {
    testFiles: testGlobs,
    sourceFiles: sourceGlobs.concat(testGlobs.map(g => `!${g}`)),
  };

  createOnChange(watcher)({
    events: ['add'],
    separateByGlobs,
    run({
      testFiles: addedTestFiles,
      sourceFiles: addedSourceFiles,
    }) {
      testFiles.push(...addedTestFiles);
      sourceFiles.push(...addedSourceFiles);
      log.vrb(`Added {testFiles: +${addedTestFiles.length}=${testFiles.length}, sourceFiles: +${addedSourceFiles.length}=${sourceFiles.length}}`);
      log.sil({ addedTestFiles, addedSourceFiles });
    }
  });

  createOnChange(watcher)({
    events: ['unlink'],
    separateByGlobs,
    run({
      testFiles: deletedTestFiles,
      sourceFiles: deletedSourceFiles,
    }) {
      testFiles = testFiles.filter(f => !deletedTestFiles.some(d => mm.contains(f, d)));
      sourceFiles = sourceFiles.filter(f => !deletedSourceFiles.some(d => mm.contains(f, d)));
      log.vrb(`Removed {testFiles: -${deletedTestFiles.length}=${testFiles.length}, sourceFiles: -${deletedSourceFiles.length}=${sourceFiles.length}}`);
      log.sil({ deletedTestFiles, deletedSourceFiles });
    }
  });

  function onChangeCreator({ run }) {
    createOnChange(watcher)({
      separateByGlobs,
      run: ({
        testFiles: changedTestFiles,
        sourceFiles: changedSourceFiles,
      }) => run({
        allFiles: allFiles(),
        testFiles,
        sourceFiles,
        changedTestFiles,
        changedSourceFiles,
      })
    });
  }

  return {
    watcher,
    onChange: onChangeCreator,
    initialAllFiles,
    initialTestFiles,
    initialSourceFiles,
  };
}
