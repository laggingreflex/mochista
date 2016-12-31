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
  alias: ['include'],
  type: 'array',
  default: [
    // '**/*.{js,coffee}',
    // './**/*.{js,coffee}',
    '{src,lib}/**/*.{js,coffee}',
    '*.{js,coffee}',
  ]
};
defaults.sourceFilesExclude = {
  alias: ['exclude'],
  type: 'array',
  default: [
    // 'node_modules',
    // '*node_modules*',
    'node_modules/**',
    // './node_modules/**',
    // './**node_modules**/**',
    // '**/node_modules/**',
    // '**node_modules**/**',
    // '**/**node_modules**/**',
    'coverage/**',
  ]
};
defaults.testFiles = {
  type: 'array',
  default: [
    '*{test,tests}*.{js,coffee}',
    '{test,tests,__test__,__tests__}/**/*.{js,coffee}',
    '{src,lib}/**/*.{test,spec}.{js,coffee}'
  ]
};
defaults.testFilesExclude = {
  alias: ['ignore'],
  type: 'array',
  default: ['**/node_modules/**'],
  // default: defaults.sourceFilesExclude.default,
};

defaults.watch = {
  alias: ['w'],
  type: 'boolean',
  default: false
};
defaults.all = {
  // alias: [ 'A' ],
  type: 'boolean',
  default: false
};
defaults.fileCountLimit = {
  type: 'number',
  default: 1000
};

defaults.browserSync = {
  alias: ['bs'],
  type: 'boolean',
  default: false
};

defaults.verbose = {
  alias: ['v'],
  type: 'count',
  default: 0
};
defaults.debug = {
  alias: ['d'],
  type: 'boolean',
  default: false
};

defaults.help = {
  alias: ['h', '?'],
  type: 'boolean'
};

export default defaults;
