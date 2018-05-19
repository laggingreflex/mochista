const mm = require('micromatch');
const initWatcher = require('./init');
const initGlobs = require('./glob');
const log = require('../utils/logger');

module.exports = async function Watcher ({
  root,
  sourceFiles: sourceGlobs,
  sourceFilesExclude: sourceGlobsExclude,
  testFiles: testGlobs,
  testFilesExclude: testGlobsExclude,
  fileCountLimit
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
    fileCountLimit
  });
  const initialAllFiles = initialSourceFiles.concat(initialTestFiles);

  let testFiles = initialTestFiles;
  let sourceFiles = initialSourceFiles;
  const allFiles = () => sourceFiles.concat(testFiles);

  const watcher = await initWatcher({
    root,
    include: [
      ...testGlobs,
      ...sourceGlobs
    ],
    exclude: [
      ...sourceGlobsExclude,
      ...testGlobsExclude
    ]
  });

  const separateByGlobs = {
    testFiles: testGlobs,
    sourceFiles: sourceGlobs.concat(testGlobs.map(g => `!${g}`))
  };

  initWatcher.createOnChange(watcher)({
    events: ['add'],
    separateByGlobs,
    run ({
      changedFiles: addedFiles,
      testFiles: addedTestFiles,
      sourceFiles: addedSourceFiles
    }) {
      if (addedTestFiles.length) {
        testFiles.push(...addedTestFiles);
        log.verbose(`Added testFiles: +${addedTestFiles.length}=${testFiles.length}`);
        addedTestFiles.reverse().forEach(f => log.silly('', f));
      }
      if (addedSourceFiles.length) {
        sourceFiles.push(...addedSourceFiles);
        log.verbose(`Added sourceFiles: +${addedSourceFiles.length}=${sourceFiles.length}`);
        addedSourceFiles.reverse().forEach(f => log.silly('', f));
      }
    }
  });

  initWatcher.createOnChange(watcher)({
    events: ['unlink'],
    separateByGlobs,
    run ({
      changedFiles: deletedFiles,
      testFiles: deletedTestFiles,
      sourceFiles: deletedSourceFiles
    }) {
      if (deletedTestFiles.length) {
        testFiles = testFiles.filter(f => !deletedTestFiles.some(d => mm.contains(f, d)));
        log.verbose(`Removed testFiles: -${deletedTestFiles.length}=${testFiles.length}`);
        deletedTestFiles.reverse().forEach(f => log.silly('', f));
      }
      if (deletedSourceFiles.length) {
        sourceFiles = sourceFiles.filter(f => !deletedSourceFiles.some(d => mm.contains(f, d)));
        log.verbose(`Removed sourceFiles: -${deletedSourceFiles.length}=${sourceFiles.length}`);
        deletedSourceFiles.reverse().forEach(f => log.silly('', f));
      }
    }
  });

  function onChangeCreator ({ run }) {
    initWatcher.createOnChange(watcher)({
      separateByGlobs,
      run: ({
        changedFiles,
        testFiles: changedTestFiles,
        sourceFiles: changedSourceFiles
      }) => {
        if (changedFiles.length) {
          log.verbose(`Changed files: ${changedFiles.length}/${allFiles().length}`);
          changedFiles.reverse().forEach(f => log.silly('', f));
        }
        if (changedTestFiles.length) {
          log.verbose(`Changed testFiles: ${changedTestFiles.length}/${testFiles.length}`);
          changedTestFiles.reverse().forEach(f => log.silly('', f));
        }
        if (changedSourceFiles.length) {
          log.verbose(`Changed sourceFiles: ${changedSourceFiles.length}/${sourceFiles.length}`);
          changedSourceFiles.reverse().forEach(f => log.silly('', f));
        }
        if (changedTestFiles.length || changedSourceFiles.length) {
          run({
            allFiles: allFiles(),
            testFiles,
            sourceFiles,
            changedFiles,
            changedTestFiles,
            changedSourceFiles
          });
        } else {
          log.silly(`No relevant files changed`);
        }
      }
    });
  }

  return {
    watcher,
    onChange: onChangeCreator,
    initialAllFiles,
    initialTestFiles,
    initialSourceFiles
  };
};
