const watch = require('file-watch-iterator');
const anymatch = require('anymatch');

module.exports = async function*(argv = {}) {

  const isTestFile = file => anymatch(argv.testFiles, file);

  const watcher = watch('.', {
    cwd: argv.cwd,
    // awaitWriteFinish: argv.awaitWriteFinish !== false,
    // followSymlinks: false,
    // ignoreInitial: true,
    ignored: argv.exclude,
  });

  for await (const _files of watcher) {
    const files = _files.toArray();

    const R = {
      // files,
      sourceFiles: [],
      testFiles: [],
      hasSourceChanged: false,
      filesToReset: [],
    };

    for (const { file, changed } of files) {

      const isValidExtension = argv.extensions.find(ext => file.endsWith(ext))

      if (!isValidExtension) continue;

      if (isTestFile(file)) {
        R.testFiles.push(file);
      } else {
        R.sourceFiles.push(file);
        if (!R.hasSourceChanged && changed) {
          R.hasSourceChanged = true;
        }
      }
      if (changed || R.hasSourceChanged) {
        R.filesToReset.push(file);
      }
    }

    yield R;
  }
};
