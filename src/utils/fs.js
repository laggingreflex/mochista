import os from 'os';
import path from 'path';
import fs from 'fs-promise';
import _ from 'lodash';

export const cwd = process.cwd();

export function generateID() {
  return 'xxxxxxxx'.replace( /x/g, x => Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 1 ) );
}

export const tmpdir = path.join( os.tmpdir(), '1nstall', generateID() );

export async function mktmpdir( tmpdir = tmpdir ) {
  console.log( `Creating ${tmpdir}...` );
  await fs.mkdirp( tmpdir );
  return tmpdir;
}

export async function getPackageJson( dir = cwd ) {
  const file = path.join( dir, 'package.json' );
  console.log( `Reading ${file}...` );
  let packageJson;
  try {
    packageJson = await fs.readJson( file );
  } catch ( err ) {}
  // console.log( packageJson );
  return packageJson || {};
}
export async function outputPackageJson( dir = tmpdir, data = {} ) {
  const file = path.join( dir, 'package.json' );
  const fileBkp = path.join( dir, `package.bkp.${Date.now() + 0}.json` );
  try {
    await fs.copy( file, fileBkp );
  } catch ( err ) {}
  console.log( `Creating ${file}...` );
  return fs.outputJson( file, data );
}

const cwd1 = cwd;
const tmpdir1 = tmpdir;
export async function move( { package: packageLiteral, cwd = cwd1, tmpdir = tmpdir1, debug = false } ) {
  const [ packageName ] = packageLiteral.split( /@/ );

  const movePackage = {
    from: path.join( tmpdir, 'node_modules', packageName ),
    to: path.join( cwd, 'node_modules', packageName ),
  };
  console.log( `Moving package... ${movePackage.from} -> ${movePackage.to}` );
  // await fs.remove( movePackage.to );
  try {
    await fs.mkdirp( path.join( movePackage.to, '..' ) );
  } catch ( error ) {
    console.error( error.message );
  }
  try {
    await fs.rename( movePackage.from, movePackage.to );
  } catch ( error ) {
    console.error( error.message );
    try {
      await fs.move( movePackage.from, movePackage.to );
    } catch ( error ) {
      console.error( error.message );
    }
  }

  const movePackageBins = {
    from: path.join( tmpdir, 'node_modules', '.bin' ),
    to: path.join( cwd, 'node_modules', '.bin' ),
  };
  console.log( `Moving package .bins... ${movePackageBins.from} -> ${movePackageBins.to}` );
  try {
    await fs.move( movePackageBins.from, movePackageBins.to );
  } catch ( error ) {
    console.error( error.message );
  }

  const movePackageModules = {
    from: path.join( tmpdir, 'node_modules' ),
    to: path.join( cwd, 'node_modules', packageName, 'node_modules' ),
  };
  console.log( `Moving package modules... ${movePackageModules.from} -> ${movePackageModules.to}` );
  try {
    await fs.rename( movePackageModules.from, movePackageModules.to );
  } catch ( error ) {
    console.error( error.message );
    try {
      await fs.move( movePackageModules.from, movePackageModules.to );
    } catch ( error ) {
      console.error( error.message );
    }
  }


  const newPackageJson = await getPackageJson( tmpdir );
  const oldPackageJson = await getPackageJson( cwd );
  const updatedPackageJson = {...oldPackageJson };
  if ( _.get( newPackageJson, `dependencies.${packageName}` ) ) {
    updatedPackageJson.dependencies = updatedPackageJson.dependencies || {};
    updatedPackageJson.dependencies[ packageName ] = newPackageJson.dependencies[ packageName ];
  } else if ( _.get( newPackageJson, `devDependencies.${packageName}` ) ) {
    updatedPackageJson.devDependencies = updatedPackageJson.devDependencies || {};
    updatedPackageJson.devDependencies[ packageName ] = newPackageJson.devDependencies[ packageName ];
  }
  await outputPackageJson( cwd, updatedPackageJson );


  if ( !debug ) {
    console.log( `Removing ${tmpdir}...` );
    try {
      await fs.remove( tmpdir );
    } catch ( error ) {
      console.error( error.message );
    }
  }
}


// export const homedir = os.homedir();
// export const homeConfigDir = path.join( homedir, '.dockere' );
// export const moduleDir = path.join( path.dirname( __filename ), '../../dockerfiles' );
// export const cwdFull = process.cwd();
// export const cwdBase = path.basename( cwdFull );

// export const rootDirText = '<root-dir>';
// export const rootDirRegex = new RegExp( rootDirText, 'ig' );
// export const cwdBaseRegex = new RegExp( '/?' + cwdBase, 'ig' );

// export function readFile( ...paths ) {
//   try {
//     return fs.readFileSync( path.join( ...paths ), 'utf8' );
//   } catch ( error ) {
//     return false;
//   }
// }

// export function readFromHome( file ) {
//   return readFile( homeConfigDir, file );
// }

// export function readFromModuleDir( file ) {
//   return readFile( moduleDir, file + '.dockerfile' );
// }

// export function readFromCwd( file ) {
//   return readFile( cwdFull, file );
// }

// export const dockerfiles = {
//   moduleDir: {
//     alpine: readFromModuleDir( 'alpine' ),
//     nodejs: readFromModuleDir( 'nodejs' ),
//     ubuntu: readFromModuleDir( 'ubuntu' ),
//   },
//   home: readFromHome( 'Dockerfile' ),
//   cwd: readFromCwd( 'Dockerfile' )
// };

// if ( !dockerfiles.moduleDir ) {
//   throw new Error( 'moduleDir Dockerfile not found.' );
// }

// export function replaceRootDirText( str ) {
//   return str.replace( rootDirRegex, '/' + cwdBase );
// }
// export function replaceCwdBaseText( str ) {
//   return str.replace( cwdBaseRegex, rootDirText );
// }

// export function writeFile( [ ...paths ], data ) {
//   fs.outputFileSync( path.join( ...paths ), data );
// }

// export function writeToHome( file, data ) {
//   writeFile( [ homeConfigDir, file ], data );
//   dockerfiles.home = data;
// }

// export function writeToCwd( data ) {
//   writeFile( [ cwdFull, 'Dockerfile' ], replaceRootDirText( data ) );
//   dockerfiles.cwd = data;
// }
