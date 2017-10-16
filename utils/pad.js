const ority = require('ority');
const pad = require('pad-right');

module.exports = (...args) => {
  let { str, len } = ority(args, [{
    str: 'string',
    len: 'number'
  }, {
    len: 'number',
    str: 'string'
  }]);
  if (len < str.length) {
    len += str.length;
  }
  return pad(str, len, ' ');
};
