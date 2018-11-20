const Path = require('path')
const report = require('c8/lib/report');
const arrify = require('arrify');
const rimraf = require('rimraf');
const { defaultExclude } = require('test-exclude')

module.exports = (argv, { files } = {}) => {

  if (!(process.version.match(/^v1[1-9]/) || process.version.match(/^v10\.[1-9]/))) {
    throw new Error('Coverage requires Node.js >= 10.10.0');
  }

  const tempDirectory = process.env.NODE_V8_COVERAGE = argv.coverageDir = process.env.NODE_V8_COVERAGE || Path.join(argv.cwd || process.cwd(), argv.coverageDir || 'coverage', '.tmp');

  try {
    report({
      // include: Array.from(files.sourceFiles).map(f => f),
      // exclude: Array.from(files.testFiles),
      // include: ['*'],
      include: [],
      exclude: defaultExclude,
      reporter: arrify(argv.report),
      tempDirectory,
      watermarks: argv.watermarks,
      resolve: '',
      omitRelative: true
    });
  } finally {
  }
  rimraf.sync(tempDirectory);
};
