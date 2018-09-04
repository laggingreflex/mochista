const c8 = require('c8');
const arrify = require('arrify');

module.exports = argv => run => new Promise((resolve, reject) => c8.run(argv, async done => {
  let runError;
  try {
    await run();
  } catch (e) { runError = e; }
  done((coverageError, reports) => {
    let reportError;
    try {
      c8.report({
        reports,
        reporter: arrify(argv.report || ['text', 'html'])
      });
    } catch (e) { reportError = e }
    const error = runError || coverageError || reportError;
    if (error) reject(error)
    else resolve();
  });
}));
