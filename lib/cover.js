const Path = require('path')
const report = require('c8/lib/report');
const arrify = require('arrify');
const rimraf = require('rimraf');
const { defaultExclude } = require('test-exclude')

module.exports = (config, files) => {

  if (!(process.version.match(/^v1[1-9]/) || process.version.match(/^v10\.[1-9]/))) {
    throw new Error('Coverage requires Node.js >= 10.10.0');
  }

  try {
    report({
      // include: Array.from(files.sourceFiles).map(f => f),
      exclude: [...defaultExclude, ...Array.from(files.testFiles)],
      // include: ['*'],
      include: [],
      // exclude: defaultExclude,
      reporter: arrify(config.report),
      tempDirectory: config.coverageTempDir,
      watermarks: config.watermarks,
      resolve: '',
      omitRelative: true
    });
  } finally {
    rimraf.sync(config.coverageTempDir);
  }
};
