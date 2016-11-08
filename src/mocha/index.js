import load from './load';
import run from './run';
import log from '.../utils/logger';

export default async function Mocha( {
  root,
  compilers,
  require: requires,
  ...config
} ) {
  return {
    load: async() => load( { compilers, requires, root } ),
    run: async( { files } ) => run( { files, ...config } ),
  };
}
