const _ = require('lodash');
const arrify = require('arrify');
const defaults = require('./defaults');

module.exports = function merge(...configs) {
  const mergedConfig = {};
  for (const newConfig of configs) {
    for (const key in newConfig) {
      const oldValue = mergedConfig[key];
      const newValue = newConfig[key];
      const defaultValue = defaults[key] ? defaults[key].default : undefined;
      if (!(key in mergedConfig)) {
        mergedConfig[key] = newValue
      } else if (_.isArray(newValue) || _.isArray(oldValue)) {
        mergedConfig[key] = arrify(oldValue).concat(arrify(newValue));
      } else if (_.isPlainObject(newValue) && _.isPlainObject(oldValue)) {
        mergedConfig[key] = _.merge({}, oldValue, newValue);
      } else if (defaultValue === newValue) {
        mergedConfig[key] = oldValue;
      } else {
        mergedConfig[key] = newValue;
      }
    }
  }
  return mergedConfig;
}
