const { promisify } = require('bluebird');
const init = require('./init');
const log = require('../utils/logger');

module.exports = async function run({ files, ...config }) {
  log('Running mocha...');
  log.time('Mocha finished in');

  const mocha = init(config);
  mocha.files = files;

  try {
    await promisify(::mocha.run)();
  } catch (err) {
    if (!err.message.match(/^[0-9]+$/))
      throw err;
  }

  log.timeEnd('Mocha finished in', 'info');

  return mocha;
}
