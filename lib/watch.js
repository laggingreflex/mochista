const watch = require('file-watch-iterator');
const anymatch = require('anymatch');
const parseGitignore = require('parse-gitignore');
const utils = require('./utils');

module.exports = async function*(config = {}) {

  const isRequireFile = file => anymatch(config.require, file);
  const isTestFile = file => anymatch(config.testFiles, file);

  const gitignore = utils.flat(utils.arrify(config.gitignore).map(utils.readFile).map(parseGitignore));
  const ignored = [...config.exclude, ...gitignore];

  const watcher = watch('.', {
    cwd: config.cwd || process.cwd(),
    // awaitWriteFinish: argv.awaitWriteFinish !== false,
    // followSymlinks: false,
    // ignoreInitial: true,
    ignored,
  });

  for await (const _files of watcher) {
    const files = _files.toArray();

    const R = {
      sourceFiles: [],
      testFiles: [],
      allFiles: [],
    };

    for (const { file, changed } of files) {

      const isValidExtension = config.extensions.find(ext => file.endsWith(ext))

      if (!isValidExtension) continue;

      R.allFiles.push(file);

      if (isRequireFile(file) || isTestFile(file)) {
        R.testFiles.push(file);
      } else {
        R.sourceFiles.push(file);
      }
    }

    yield R;
  }
};
