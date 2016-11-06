import mm from 'micromatch';

export default function resetRequireCache( filesToDelete ) {
  // console.time( 'Resetting require cache done' );

  for ( const cacheFile in require.cache ) {
    for ( const fileToDelete of filesToDelete ) {
      const exists = mm.contains( cacheFile, fileToDelete );
      // console.log(`${exists} = mm.contains(${cacheFileache}, ${fileToDelete})`);
      if ( exists ) {
        console.log( `Reseting ${cacheFile}` )
        delete require.cache[ cacheFile ];
        break;
      }
    }

  }
  // console.timeEnd( 'Resetting require cache done' );
}
