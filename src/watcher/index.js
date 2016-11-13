import initWatcher, { createOnChange } from './init';

export default async function Watcher({
  root,
  sourceFiles: sourceGlobs,
  sourceFilesExclude: sourceGlobsExclude,
  testFiles: testGlobs,
  testFilesExclude: testGlobsExclude,
  fileCountLimit,
} = {}) {

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

  function onChange(opts) {
    createOnChange(watcher)({
      separateByGlobs: {
        testFiles: testGlobs,
        sourceFiles: sourceGlobs.concat(testGlobs.map(g => `!${g}`)),
      },
      ...opts
    });
  }

  return { watcher, onChange };
}
