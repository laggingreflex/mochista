import initLoad from './init';
import runner from './runner';

export default async function Mocha( {
  root,
  compilers,
  require: requires,
  ...config
} ) {
  return {
    async init() {
      return initLoad( { compilers, requires, root } );
    },
    async run( { files } ) {
      return runner( { files, ...config } );
    }
  };
}
