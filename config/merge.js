const _ = require('lodash');
const arrify = require('arrify');
const arrayEqual = require('array-equal');
const defaults = require('./defaults/defaults');
// console.log(`defaults:`, defaults);

module.exports = function merge (...configs) {
  const mergedConfig = {};
  for (const newConfig of configs) {
    for (const key in newConfig) {
      const oldValue = mergedConfig[key];
      const newValue = newConfig[key];
      const defValue = defaults[key];
      if (!(key in mergedConfig)) {
        mergedConfig[key] = newValue;
      } else if (_.isArray(newValue) || _.isArray(oldValue)) {
        mergedConfig[key] = arrify(oldValue).concat(arrify(newValue));
      } else if (_.isPlainObject(newValue) && _.isPlainObject(oldValue)) {
        mergedConfig[key] = _.merge({}, oldValue, newValue);
      } else if (typeof defValue === 'string' && defValue === newValue) {
        mergedConfig[key] = oldValue;
      } else if (Array.isArray(defValue) && arrayEqual(defValue, newValue)) {
        mergedConfig[key] = oldValue;
      } else {
        mergedConfig[key] = newValue;
      }
    }
  }
  return mergedConfig;
};
