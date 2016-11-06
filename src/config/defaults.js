const defaults = {};

defaults.root = {
  type: 'string',
  default: process.cwd()
};
defaults.sourceFiles = {
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
defaults.ui = {
  alias: [ 'u', ],
  type: 'string',
  default: 'bdd'
};
defaults.watch = {
  alias: [ 'w', ],
  type: 'boolean',
  default: false
};
defaults.grep = {
  alias: [ 'g', ],
  type: 'string'
};
defaults.compilers = {
  type: 'array',
  default: []
};
defaults.require = {
  type: 'array',
  default: []
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
