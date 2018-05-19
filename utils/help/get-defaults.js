const { get } = require('lodash');
const defaults = require('../../config/defaults');

module.exports = function getDefaultss (option) {
  let def = get(defaults, `${option}.default`);
  if (def instanceof Array) {
    def = def.join(' ');
  }
  if (!def) {
    def = 'no default';
  }
  return def;
};
