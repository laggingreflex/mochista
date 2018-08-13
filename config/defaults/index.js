const _ = require('lodash');
const mocha = require('./mocha');
const istanbul = require('./istanbul');
const fix = require('./fix');

let defaultConfig = {
  ...mocha,
  ...istanbul
};

defaultConfig.root = {
  type: 'string',
  default: process.cwd()
};
defaultConfig.sourceFiles = {
  alias: ['include'],
  type: 'array',
  default: ['**/*.js' ]
  // default: [
  //   // '**/*.{js,coffee}',
  //   // './**/*.{js,coffee}',
  //   '{src,lib}/**/*.{js,coffee}',
  //   '*.{js,coffee}',
  // ]
};
defaultConfig.sourceFilesExclude = {
  alias: ['exclude'],
  type: 'array',
  default: [
    // 'node_modules',
    // '*node_modules*',
    'node_modules',
    // 'node_modules/**',
    // 'node_modules/.*',
    '.git',
    // '.git/**',
    // '.git/.*',
    // './node_modules/**',
    // './**node_modules**/**',
    // '**/node_modules/**',
    // '**node_modules**/**',
    // '**/**node_modules**/**',
    'coverage'
  ]
};
defaultConfig.testFiles = {
  type: 'array',
  default: [
    '**/*test.js',
    '*test*/**/*.js'
  ]
  // default: [
  //   '*{test,tests}*.{js,coffee}',
  //   '{test,tests,__test__,__tests__}/**/*.{js,coffee}',
  //   '{src,lib}/**/*.{test,spec}.{js,coffee}',
  // ],
};
defaultConfig.testFilesExclude = {
  alias: ['ignore'],
  type: 'array',
  default: ['**/node_modules/**']
  // default: defaults.sourceFilesExclude.default,
};

defaultConfig.watch = {
  alias: ['w'],
  type: 'boolean',
  default: false
};
defaultConfig.runAll = {
  type: 'boolean',
  default: false
};
defaultConfig.fileCountLimit = {
  type: 'number',
  default: 1000
};

defaultConfig.instrument = {
  type: 'boolean',
  default: true
};

defaultConfig.browserSync = {
  alias: ['bs'],
  type: 'boolean',
  default: false
};

defaultConfig.verbose = {
  alias: ['v'],
  type: 'number',
  default: 0
};
defaultConfig.debug = {
  alias: ['d'],
  type: 'boolean',
  default: false
};

defaultConfig.help = {
  alias: ['h', '?'],
  type: 'boolean'
};

defaultConfig = fix(defaultConfig);

module.exports = defaultConfig;
