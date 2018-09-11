const Path = require('path')
const report = require('c8/lib/report');
const arrify = require('arrify');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const { defaultExclude } = require('test-exclude')

module.exports = argv => (run, { files }) => Promise.resolve().then(async function cover() {

  if (!process.version.match(/^v10.10/)) {
    throw new Error('Coverage requires Node.js >= 10.10.0');
  }

  const cwd = argv.cwd || process.cwd();
  const tempDirectory = process.env.NODE_V8_COVERAGE = process.env.NODE_V8_COVERAGE || Path.join(cwd, argv.coverageDir, '.tmp');

  rimraf.sync(tempDirectory);
  mkdirp.sync(tempDirectory);

  let runError;
  try {
    await run();
  } catch (e) { runError = e; }

  let reportError;
  try {
    report({
      // include: Array.from(files.sourceFiles),
      // exclude: Array.from(files.testFiles),
      include: [],
      exclude: defaultExclude,
      reporter: arrify(argv.report),
      tempDirectory,
      watermarks: argv.watermarks,
      resolve: '',
      omitRelative: true
    });
  } catch (e) { reportError = e; }

  const error = runError || reportError;
  if (error) throw error;
});
