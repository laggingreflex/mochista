const levels = {};

function createLevel(name, color = 6, fd = 1) {
  let level = Object.keys(levels).length;
  let suffix, prefix;
  if (name.length <= 5) {
    suffix = `:${name}`;
    prefix = Array(6 - name.length).join(' ')
  } else {
    suffix = `:${name.substr(0,4)}`;
    prefix = ' ';
  }
  return {
    [name]: {
      level,
      color,
      prefix,
      namespaceSuffix: suffix,
    }
  }
}

const add = (...args) => Object.assign(levels, createLevel(...args));

add('error', 1, 2);
add('log', '');
add('warn', 3, 2);
add('debug', 3);
add('verbose', 0);
add('info', 2);
add('silly', 0);
add('trace', 0);

levels.inf = levels.info;
levels.wrn = levels.warn;
levels.sil = levels.silly;
levels.verb = levels.verbose;
levels.vrb = levels.verbose;
levels.err = levels.error;

module.exports = levels;
