const c8 = require('c8');

module.exports = argv => async run => {
  // console.log(`reports..`);
  const reports = await c8.run(argv, run);
  // console.log(`reports:`, reports);
  c8.report({
    reports,
    reporter: argv.coverageReporter || ['text', 'html']
  });
};

exports.instrument = async () => {};
exports.report = async () => {};
