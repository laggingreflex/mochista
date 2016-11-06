export default function checkTestExcludes( {
  sourceFilesExclude,
  testFiles
} ) {
  const offendingPatterns = []
  sourceFilesExclude.forEach( sfx => {
    if ( testFiles.includes( sfx ) ) {
      offendingPatterns.push( sfx );
    }
  } );
  if ( offendingPatterns.length ) {
    console.error( `ERROR: You've specfied {sourceFilesExclude} patterns that match {testFiles} patterns indicating that you're trying to exclude test-files from source-files. You don't have to do that. Please remove the following patterns from {sourceFilesExclude}:`, offendingPatterns );
    throw new Error( '{sourceFilesExclude} patterns contain {testFiles} patterns' );
  }
}
