const load = require('./load');
const run = require('./run');
const log = require('../utils/logger');

module.exports = async function Mocha({
  root,
  compilers,
  require: requires,
  ...config
}) {
  return {
    load: async() => load({ compilers, requires, root }),
    run: async({ files }) => run({ files, ...config }),
  };
}
