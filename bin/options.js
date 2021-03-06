module.exports = {
  cwd: {
    type: 'string',
    // default: process.cwd(),
    description: 'Current dir'
  },
  testFiles: {
    alias: ['t'],
    type: 'array',
    default: [
      '*test*/**',
      '**/*.test.*',
      '**/test.*',
    ],
    description: 'Files to test (anymatch)',
  },
  sourceFiles: {
    alias: ['s'],
    type: 'array',
    default: ['.'],
    description: 'Source files (for coverage) (anymatch)',
  },
  exclude: {
    type: 'array',
    default: ['.*', 'node_modules', 'coverage'],
    description: 'Files to exclude (anymatch)',
  },
  gitignore: {
    type: 'string',
    default: ['.gitignore', '~/.gitignore'],
    description: 'Files to exclude based on .gitignore',
  },
  extensions: {
    type: 'array',
    default: ['.js'],
    description: 'Extensions to monitor (all other files ignored)',
  },
  watch: {
    alias: ['w'],
    // type: 'boolean',
    description: 'Watch for file changes and re-run. `--watch=i` to only re-run on pressing Enter',
  },
  parallel: {
    type: 'boolean',
    description: 'Use mocha-parallel-tests to run each of your test files in a separate process',
  },
  coverage: {
    type: 'boolean',
    default: true,
    description: 'Collect coverage (use --no-coverage to disable)',
  },
  coverageDir: {
    type: 'string',
    default: './coverage',
    description: 'Directory to output coverage and reports',
  },
  coverageServer: {
    type: 'boolean',
    description: 'Run live-server (via npx) on coverage dir',
  },
  reporter: {
    type: 'string',
    default: 'spec',
    description: 'Mocha reporter',
  },
  report: {
    type: 'array',
    default: ['text', 'lcov', 'html'],
    description: 'Istanbul reporters',
  },
  require: {
    alias: ['r'],
    type: 'array',
    default: [],
    description: 'Require the given module',
  },
  all: {
    alias: ['a'],
    type: 'boolean',
    description: 'Instrument all files',
  },
  'mocha-xxx': {
    description: 'All mocha-related options, like --mocha-fgrep etc',
  },
  'config': {
    type: 'string',
    default: 'mochista.config.js',
    description: 'JS file path that exports config or a function that does'
  },
};
