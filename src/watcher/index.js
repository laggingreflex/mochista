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
      ...testGlobs,
      ...sourceGlobs,
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
      changedFiles: addedFiles,
      testFiles: addedTestFiles,
      sourceFiles: addedSourceFiles,
    }) {
      if (addedTestFiles.length) {
        testFiles.push(...addedTestFiles);
        log.vrb(`Added testFiles: +${addedTestFiles.length}=${testFiles.length}`);
        addedTestFiles.reverse().forEach(f => log.sil('', f))
      }
      if (addedSourceFiles.length) {
        sourceFiles.push(...addedSourceFiles);
        log.vrb(`Added sourceFiles: +${addedSourceFiles.length}=${sourceFiles.length}`);
        addedSourceFiles.reverse().forEach(f => log.sil('', f))
      }
    }
  });

  createOnChange(watcher)({
    events: ['unlink'],
    separateByGlobs,
    run({
      changedFiles: deletedFiles,
      testFiles: deletedTestFiles,
      sourceFiles: deletedSourceFiles,
    }) {
      if (deletedTestFiles.length) {
        testFiles = testFiles.filter(f => !deletedTestFiles.some(d => mm.contains(f, d)));
        log.vrb(`Removed testFiles: -${deletedTestFiles.length}=${testFiles.length}`);
        deletedTestFiles.reverse().forEach(f => log.sil('', f))
      }
      if (deletedSourceFiles.length) {
        sourceFiles = sourceFiles.filter(f => !deletedSourceFiles.some(d => mm.contains(f, d)));
        log.vrb(`Removed sourceFiles: -${deletedSourceFiles.length}=${sourceFiles.length}`);
        deletedSourceFiles.reverse().forEach(f => log.sil('', f))
      }
    }
  });

  function onChangeCreator({ run }) {
    createOnChange(watcher)({
      separateByGlobs,
      run: ({
        changedFiles,
        testFiles: changedTestFiles,
        sourceFiles: changedSourceFiles,
      }) => {
        if (changedFiles.length) {
          log.vrb(`Changed files: ${changedFiles.length}/${allFiles().length}`);
          changedFiles.reverse().forEach(f => log.sil('', f))
        }
        if (changedTestFiles.length) {
          log.vrb(`Changed testFiles: ${changedTestFiles.length}/${testFiles.length}`);
          changedTestFiles.reverse().forEach(f => log.sil('', f))
        }
        if (changedSourceFiles.length) {
          log.vrb(`Changed sourceFiles: ${changedSourceFiles.length}/${sourceFiles.length}`);
          changedSourceFiles.reverse().forEach(f => log.sil('', f))
        }
        if (changedTestFiles.length || changedSourceFiles.length) {
          run({
            allFiles: allFiles(),
            testFiles,
            sourceFiles,
            changedFiles,
            changedTestFiles,
            changedSourceFiles,
          })
        } else {
          log.sil(`No relevant files changed`);
        }
      }
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
