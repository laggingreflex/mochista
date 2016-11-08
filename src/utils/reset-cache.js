import mm from 'micromatch';
import log from '.../utils/logger';

export default function resetRequireCache( filesToDelete ) {
  // log.time('Reset require cache');

  for ( const cacheFile in require.cache ) {
    for ( const fileToDelete of filesToDelete ) {
      const exists = mm.contains( cacheFile, fileToDelete );
      // log.silly(`${exists} = mm.contains(${cacheFileache}, ${fileToDelete})`);
      if ( exists ) {
        log.verb( `Resetting ${cacheFile}` )
        delete require.cache[ cacheFile ];
        break;
      }
    }

  }
  // log.timeEnd('Reset require cache', 'info');
}
