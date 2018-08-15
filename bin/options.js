module.exports = {
  cwd: {
    type: 'string',
    // default: process.cwd(),
    description: 'Current dir'
  },
  testFiles: {
    type: 'array',
    default: [
      '*test*/**',
      '**/*.test.*',
    ],
    description: 'Files to test (anymatch)',
  },
  sourceFiles: {
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
