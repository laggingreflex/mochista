module.exports = {
  cwd: {
    type: 'string',
    default: process.cwd(),
    description: 'Current dir'
  },
  testFiles: {
    type: 'array',
    default: [
      '*test*/**',
      '**/*.test.*',
    ],
    description: 'Files to test (chokidar compatible)',
  },
  sourceFiles: {
    type: 'array',
    default: ['.'],
    description: 'Source files (for coverage) (chokidar compatible)',
  },
  exclude: {
    type: 'array',
    default: ['.*', 'node_modules', 'coverage'],
    description: 'Files to exclude (chokidar compatible)',
  },
  extensions: {
    type: 'array',
    default: ['.js'],
    description: 'Extensions to monitor (all other files ignored)',
  },
  watch: {
    alias: ['w'],
    // type: 'boolean',
    description: 'Watch for file changes and re-run. `--watch=i` only re-runs on key input',
  },
  coverage: {
    type: 'boolean',
    default: true,
    description: 'Collect coverage',
  },
  mochaReporter: {
    alias: ['reporter'],
    type: 'string',
    default: 'spec',
    description: 'Mocha reporter',
  },
  coverageReporter: {
    alias: ['report'],
    type: 'array',
    default: ['text', 'lcov', 'html'],
    description: 'Istanbul coverage reporters',
  },
};
