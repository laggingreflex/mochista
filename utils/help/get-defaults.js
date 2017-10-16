import {get } from 'lodash';
import defaults from '.../config/defaults';

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
