import mocha from './mocha';
import istanbul from './istanbul';

const defaults = {
  ...mocha,
  ...istanbul,
};

defaults.root = {
  type: 'string',
  default: process.cwd()
};
defaults.sourceFiles = {
  alias: [ 'include', ],
  type: 'array',
  default: [
    // '**/*.js',
    // './**/*.js',
    'src/**/*.js',
  ]
};
defaults.sourceFilesExclude = {
  alias: [ 'exclude', ],
  type: 'array',
  default: [
    'node_modules/**',
    // '**/node_modules/**',
    // 'coverage/**',
  ]
};
defaults.testFiles = {
  type: 'array',
  default: [ 'test*/**/*.js', '**/*.{test,spec}.js', ]
};
defaults.testFilesExclude = {
  alias: [ 'ignore', ],
  type: 'array',
  default: [ '**/node_modules/**' ]
};

defaults.watch = {
  alias: [ 'w', ],
  type: 'boolean',
  default: false
};
defaults.fileCountLimit = {
  type: 'number',
  default: 1000
};
defaults.help = {
  alias: [ 'h', '?' ],
  type: 'boolean'
};

export default defaults;
