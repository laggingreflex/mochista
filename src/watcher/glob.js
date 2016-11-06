import { props } from 'bluebird';
import _glob from 'globby';

export default async function init( {
  root,
  sourceGlobs,
  sourceGlobsExclude,
  testGlobs,
  testGlobsExclude,
  fileCountLimit,
} ) {
  return props( {
    testFilesList: glob( {
      root,
      include: testGlobs,
      exclude: testGlobsExclude,
      label: 'testFiles',
      fileCountLimit,
    } ),
    sourceFilesList: glob( {
      root,
      include: sourceGlobs,
      exclude: sourceGlobsExclude.concat( testGlobs ),
      label: 'sourceFiles',
      fileCountLimit,
    } )
  } );
}

export async function glob( {
  root,
  include = [],
  exclude = [],
  fileCountLimit = 1000,
  label = 'files',
} = {} ) {

  console.log( `Globing ${label}...` );
  console.time( `Globing ${label} finished` );

  const files = await _glob( [
    ...include,
    ...exclude.map( p => '!' + p ),
  ], {
    cwd: root,
    root,
  } );

  if ( files.length > fileCountLimit ) {
    console.error( files )
    throw new Error( `ERROR: Too many {${label}: ${files.length}}. Check your include/exclude glob patterns or increase {fileCountLimit: ${fileCountLimit}}` );
  }

  // console.log({[label]: files});
  console.timeEnd( `Globing ${label} finished` );

  return files;
}
