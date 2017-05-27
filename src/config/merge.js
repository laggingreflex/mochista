import _ from 'lodash';
import arrify from 'arrify';

export default function merge(...configs) {
  const mergedConfig = {};
  for (const newConfig of configs) {
    for (const key in newConfig) {
      const oldValue = mergedConfig[key];
      const newValue = newConfig[key];
      if (!(key in mergedConfig)) {
        mergedConfig[key] = newValue
      } else if (_.isArray(newValue) || _.isArray(oldValue)) {
        mergedConfig[key] = arrify(oldValue).concat(arrify(newValue));
      } else if (_.isPlainObject(newValue) && _.isPlainObject(oldValue)) {
        mergedConfig[key] = _.merge({}, oldValue, newValue);
      } else {
        mergedConfig[key] = newValue;
      }
    }
  }
  return mergedConfig;
}
