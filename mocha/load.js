const { tryRequire } = require('../utils/require');
const log = require('../utils/logger');

module.exports = function initLoad({
  root,
  compilers,
  requires
}) {
  module.exports.loadCompilers(compilers, root);
  module.exports.loadRequires(requires, root);
}

module.exports.loadCompilers = function (compilers, root) {
  if (!compilers.length) return;
  log('Loading compilers...');
  // log.time( 'Compilers loaded in' );
  compilers.map(c => c.split(':').pop()).forEach(r => tryRequire(r, root));
  // log.timeEnd( 'Compilers loaded in', 'info' );
}

module.exports.loadRequires = function (requires, root) {
  if (!requires.length) return;
  log('Loading requires...');
  // log.time( 'Requires loaded in' );
  requires.forEach(r => tryRequire(r, root));
  // log.timeEnd( 'Requires loaded in', 'info' );
}
