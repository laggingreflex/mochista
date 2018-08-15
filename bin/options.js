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
  coverage: {
    type: 'boolean',
    default: true,
    description: 'Collect coverage (use --no-coverage to disable)',
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
  'mocha-xxx': {
    description: 'All mocha-related options, like --mocha-fgrep etc',
  },
};
