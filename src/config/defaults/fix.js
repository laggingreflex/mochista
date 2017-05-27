import _ from 'lodash';
import arrify from 'arrify';

export default function fix(defaults) {
  defaults = duplicateAliases(defaults);
  return defaults;
}

function duplicateAliases(defaults) {
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
