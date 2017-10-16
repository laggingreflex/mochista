import { tryRequire } from '.../utils/require';
import log from '.../utils/logger';

export default function initLoad({
  root,
  compilers,
  requires
}) {
  loadCompilers(compilers, root);
  loadRequires(requires, root);
}

export function loadCompilers(compilers, root) {
  if (!compilers.length) return;
  log('Loading compilers...');
  // log.time( 'Compilers loaded in' );
  compilers.map(c => c.split(':').pop()).forEach(r => tryRequire(r, root));
  // log.timeEnd( 'Compilers loaded in', 'info' );
}

export function loadRequires(requires, root) {
  if (!requires.length) return;
  log('Loading requires...');
  // log.time( 'Requires loaded in' );
  requires.forEach(r => tryRequire(r, root));
  // log.timeEnd( 'Requires loaded in', 'info' );
}
