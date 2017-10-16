const {get } = require('lodash');
const defaults = require('.../config/defaults');

export default function getDefaultss(option) {
  let def = get(defaults, `${option}.default`);
  if (def instanceof Array) {
    def = def.join(' ');
  }
  if (!def) {
    def = 'no default';
  }
  return def;
}