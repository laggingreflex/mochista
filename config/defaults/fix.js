const _ = require('lodash');
const arrify = require('arrify');

module.exports = function fix (defaults) {
  defaults = duplicateAliases(defaults);
  return defaults;
};

function duplicateAliases (defaults) {
  for (const key in defaults) {
    const def = defaults[key];
    for (const alias of arrify(def.alias)) {
      if (!(alias in defaults)) {
        defaults[alias] = def;
      }
    }
  }
  return defaults;
}
