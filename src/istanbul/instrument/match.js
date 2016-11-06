// import { matcherFor } from 'babel-istanbul';
import mm from 'micromatch';

export default function matchFn( {
  files,
} ) {
  return ( file ) => {
    let r;
    for ( const f of files ) {
      if ( r ) break;
      r = mm.contains( file, f );
      // console.log(`${r1} = mm.contains( ${file}, ${p} )`);
    }
    return r;
  }
}
