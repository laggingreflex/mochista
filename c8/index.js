const c8 = require('c8');

module.exports = async (config, run) => {
  const reports = await c8.run(config, run);
  // console.log(`reports:`, reports);
  c8.report({
    reports,
    reporter: ['text', 'html']
  });
};

exports.instrument = async () => {};
exports.report = async () => {};
