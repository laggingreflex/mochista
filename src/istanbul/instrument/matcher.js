import mm from 'micromatch';
import log from '.../utils/logger';

export default function createMatcherFn({ files }) {
  return file => {
    let r;
    for (const f of files) {
      if (r) break;
      r = mm.contains(file, f);
      // log.sil( `Checking file for instrumentation:`, file, r );
    }
    if (r) {
      log.sil(`Selected file for instrumentation :`, file);
    } else {
      // log.sil( `Skipping file for instrumentation:`, file );
    }
    return r;
  }
}
